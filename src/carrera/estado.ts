// Estado y reglas de los meses de Carrera. Funciones puras (probadas en mes.test.ts) + persistencia local.
import casosPm from '../../content/casos.json';
import casosResico from '../../content/casos_resico.json';
import params from '../../content/parametros/2026.json';
import pyme from '../../content/carrera/pyme-feb-2026.json';
import resico from '../../content/carrera/resico-mar-2026.json';
import { mismaPoliza, type Movimiento } from '../engine/contable';
import { isrResicoMensual, ivaDelMes, type TablaResico } from '../engine/fiscal';

export type Tarea = {
  id: string; fecha: string; tipo: 'poliza' | 'opcion' | 'calculo' | 'declaracion' | 'mensaje'; leccion: string; correo: string;
  caso?: string; poliza?: string; concepto?: string; control?: boolean;
  pregunta?: string; opciones?: string[]; correcta?: number; explicacion?: string;
};
export type Mes = {
  id: string; titulo: string; empresa: string; regimen: string; puesto: string; jefe: string;
  declaracion: 'iva' | 'resico'; caso_declaracion?: string; vencimiento: string; tareas: Tarea[];
  precargados?: { fecha: string; nota: string; polizas: Omit<Movimiento, 'poliza'>[][] };
};
export const MESES = [pyme, resico] as Mes[];
export const MES = MESES[0];

export type Iva = ReturnType<typeof ivaDelMes>;
export type Resico = ReturnType<typeof isrResicoMensual> & { cobrado: number; devoluciones: number };
export type EstadoMes = {
  version: 1; mes: string; retraso: number;
  tareas: Record<string, { ok: boolean; fecha: string }>;
  movimientos: Movimiento[];
  declaracion?: (Iva | Resico) & { fecha: string };
};

const casos = [...casosPm, ...casosResico];
export const tablaResico = params.resico_pf_mensual.tabla as TablaResico;

export const precargados = (m: Mes = MES): Movimiento[] =>
  (m.precargados?.polizas ?? []).flatMap((p, i) => p.map((mv) => ({ ...mv, poliza: `PRE-${i + 1}` })));

export const solucionTarea = (t: Tarea): Movimiento[] =>
  (casos.find((c) => c.id === t.caso)!.movimientos as Movimiento[])
    .filter((m) => m.poliza === t.poliza)
    .map((m) => ({ ...m, poliza: t.id }));

/** Libro como debería quedar si todo se registra bien. */
export const libroSolucion = (m: Mes = MES): Movimiento[] => [...precargados(m), ...m.tareas.filter((t) => t.tipo === 'poliza').flatMap(solucionTarea)];

/** Declaración correcta del mes, según su tipo. */
export function declaracionCorrecta(m: Mes): Iva | Resico {
  if (m.declaracion === 'iva') return ivaDelMes(libroSolucion(m));
  const d = casosResico.find((c) => c.id === m.caso_declaracion)!.datos;
  return { cobrado: d.cobrado, devoluciones: d.devoluciones, ...isrResicoMensual(d.cobrado - d.devoluciones, tablaResico, d.retenido) };
}

const igual = (a: object, b: object) => {
  const ka = Object.keys(a).sort();
  return JSON.stringify(ka) === JSON.stringify(Object.keys(b).sort()) && ka.every((k) => (a as never)[k] === (b as never)[k]);
};

export const nuevoEstado = (m: Mes = MES): EstadoMes => ({ version: 1, mes: m.id, retraso: 0, tareas: {}, movimientos: precargados(m) });

export function sumarDias(fecha: string, dias: number) {
  const d = new Date(`${fecha}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

export const mesDe = (e: EstadoMes) => MESES.find((m) => m.id === e.mes)!;
export const tareaActual = (e: EstadoMes) => mesDe(e).tareas.find((t) => !e.tareas[t.id]);

/** Marca una tarea (opción, cálculo o mensaje) como resuelta. */
export const resolver = (e: EstadoMes, t: Tarea, ok: boolean): EstadoMes =>
  ({ ...e, tareas: { ...e.tareas, [t.id]: { ok, fecha: sumarDias(t.fecha, e.retraso) } } });

/** Registra una póliza del jugador (cuadrada) y si coincide con la solución. */
export function registrarPoliza(e: EstadoMes, t: Tarea, movs: Movimiento[]): EstadoMes {
  const propios = movs.map((m) => ({ ...m, poliza: t.id }));
  return { ...resolver(e, t, mismaPoliza(propios, solucionTarea(t))), movimientos: [...e.movimientos, ...propios] };
}

export function presentarDeclaracion(e: EstadoMes, t: Tarea, declarada: Iva | Resico): EstadoMes {
  const r = resolver(e, t, igual(declarada, declaracionCorrecta(mesDe(e))));
  return { ...r, declaracion: { ...declarada, fecha: r.tareas[t.id].fecha } };
}

/** Evaluación del cierre. null = la dimensión no aplica este mes. */
export function evaluar(e: EstadoMes) {
  const m = mesDe(e);
  const tareas = (tipo: Tarea['tipo']) => m.tareas.filter((t) => t.tipo === tipo);
  const trabajo = tareas('poliza').length ? tareas('poliza') : [...tareas('opcion'), ...tareas('calculo')];
  const control = m.tareas.find((t) => t.control);
  const decl = tareas('declaracion')[0];
  const decla = e.declaracion;
  return {
    registro: { correctas: trabajo.filter((t) => e.tareas[t.id]?.ok).length, total: trabajo.length },
    control: control ? !!e.tareas[control.id]?.ok : null,
    cumplimiento: !!decla && decla.fecha <= m.vencimiento,
    fiscal: {
      correcta: !!e.tareas[decl.id]?.ok,
      // Solo con contabilidad propia tiene sentido comparar contra "tu libro"
      coherente: m.declaracion === 'iva' ? !!decla && igual(ivaDelMes(e.movimientos), { trasladado: (decla as Iva).trasladado, acreditable: (decla as Iva).acreditable, aCargo: (decla as Iva).aCargo, aFavor: (decla as Iva).aFavor }) : null,
    },
    comunicacion: !!e.tareas[tareas('mensaje')[0].id]?.ok,
  };
}

const CLAVE = 'simcont.carrera.v1';
export function cargarMes(m: Mes): EstadoMes {
  try {
    for (const clave of [`${CLAVE}:${m.id}`, CLAVE]) { // CLAVE sin sufijo: formato de la Fase 1, solo PyME
      const e = JSON.parse(localStorage.getItem(clave) ?? 'null');
      if (e?.version === 1 && e.mes === m.id) return e;
    }
  } catch { /* almacenamiento no disponible o dañado: empezar el mes de nuevo */ }
  return nuevoEstado(m);
}
export function guardarMes(e: EstadoMes) {
  try { localStorage.setItem(`${CLAVE}:${e.mes}`, JSON.stringify(e)); } catch { /* modo privado: el mes vive solo en memoria */ }
}
