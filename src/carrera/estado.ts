// Estado y reglas de los meses de Carrera. Funciones puras (probadas en mes.test.ts) + persistencia local.
import casosPm from '../../content/casos.json';
import casosResico from '../../content/casos_resico.json';
import params from '../../content/parametros/2026.json';
import pyme from '../../content/carrera/pyme-feb-2026.json';
import resico from '../../content/carrera/resico-mar-2026.json';
import { mismaPoliza, type Movimiento } from '../engine/contable';
import { isrResicoMensual, ivaDelMes, type TablaResico } from '../engine/fiscal';
import { avisarGuardado } from '../sync';

export type Tarea = {
  id: string; fecha: string; tipo: 'poliza' | 'opcion' | 'calculo' | 'declaracion' | 'mensaje'; leccion: string; correo: string;
  caso?: string; poliza?: string; concepto?: string; control?: boolean;
  pregunta?: string; opciones?: string[]; correcta?: number; explicacion?: string;
};
export type Mes = {
  id: string; titulo: string; empresa: string; regimen: string; puesto: string; jefe: string;
  declaracion: 'iva' | 'resico'; caso_declaracion?: string; vencimiento: string; tareas: Tarea[]; supuestos?: string[];
  precargados?: { fecha: string; nota: string; polizas: Omit<Movimiento, 'poliza'>[][] };
};
export const MESES = [pyme, resico] as Mes[];
export const MES = MESES[0];

export type Iva = ReturnType<typeof ivaDelMes>;
export type Resico = Omit<ReturnType<typeof isrResicoMensual>, 'alerta'> & { cobrado: number; devoluciones: number };
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
  const { alerta: _, ...r } = isrResicoMensual(d.cobrado - d.devoluciones, tablaResico, d.retenido);
  return { cobrado: d.cobrado, devoluciones: d.devoluciones, ...r };
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

/** La tarea debe ser del mes, del tipo esperado y no estar resuelta; el periodo se bloquea al presentar la declaración. */
function exigir(e: EstadoMes, t: Tarea, tipos: Tarea['tipo'][]) {
  if (!mesDe(e).tareas.includes(t)) throw new Error(`La tarea ${t.id} no pertenece al mes ${e.mes}`);
  if (!tipos.includes(t.tipo)) throw new Error(`La tarea ${t.id} es de tipo ${t.tipo}`);
  if (e.tareas[t.id]) throw new Error(`La tarea ${t.id} ya se resolvió; las rectificaciones se hacen con reversión, no repitiendo el registro`);
  if (e.declaracion && t.tipo === 'poliza') throw new Error('Periodo cerrado: la declaración ya se presentó (corregir requiere complementaria)');
}

/** Marca una tarea (opción, cálculo o mensaje) como resuelta. */
export function resolver(e: EstadoMes, t: Tarea, ok: boolean): EstadoMes {
  exigir(e, t, ['opcion', 'calculo', 'mensaje']);
  return marcar(e, t, ok);
}
const marcar = (e: EstadoMes, t: Tarea, ok: boolean): EstadoMes =>
  ({ ...e, tareas: { ...e.tareas, [t.id]: { ok, fecha: sumarDias(t.fecha, e.retraso) } } });

/** Registra una póliza del jugador (cuadrada) y si coincide con la solución. */
export function registrarPoliza(e: EstadoMes, t: Tarea, movs: Movimiento[]): EstadoMes {
  exigir(e, t, ['poliza']);
  const propios = movs.map((m) => ({ ...m, poliza: t.id }));
  return { ...marcar(e, t, mismaPoliza(propios, solucionTarea(t))), movimientos: [...e.movimientos, ...propios] };
}

export function presentarDeclaracion(e: EstadoMes, t: Tarea, declarada: Iva | Resico): EstadoMes {
  exigir(e, t, ['declaracion']);
  const r = marcar(e, t, igual(declarada, declaracionCorrecta(mesDe(e))));
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

/** Valida la forma de un estado guardado (puede venir dañado o de otra versión). */
export function esEstadoValido(e: unknown, m: Mes): e is EstadoMes {
  if (!e || typeof e !== 'object') return false;
  const x = e as EstadoMes;
  const ids = new Set(m.tareas.map((t) => t.id));
  const cent = (v: unknown) => Number.isSafeInteger(v) && (v as number) >= 0;
  return x.version === 1 && x.mes === m.id && Number.isSafeInteger(x.retraso) && x.retraso >= 0
    && !!x.tareas && typeof x.tareas === 'object'
    && Object.entries(x.tareas).every(([id, r]) => ids.has(id) && typeof r?.ok === 'boolean' && /^\d{4}-\d{2}-\d{2}$/.test(r.fecha))
    && Array.isArray(x.movimientos)
    && x.movimientos.every((mv) => typeof mv?.cuenta === 'string' && typeof mv.poliza === 'string' && cent(mv.cargo) && cent(mv.abono));
}

export const CLAVE_CARRERA = 'simcont.carrera.v1';
const CLAVE = CLAVE_CARRERA;
/** Carga el mes; si un guardado está dañado, lo respalda en "<clave>:corrupto" (sin borrarlo) y prueba el siguiente. */
export function cargarMes(m: Mes): EstadoMes {
  for (const clave of [`${CLAVE}:${m.id}`, CLAVE]) { // CLAVE sin sufijo: formato de la Fase 1, solo PyME
    try {
      const crudo = localStorage.getItem(clave);
      if (crudo === null) continue;
      const e = JSON.parse(crudo);
      if (e?.mes !== undefined && e.mes !== m.id) continue; // guardado de otro mes en la clave antigua
      if (esEstadoValido(e, m)) return e;
      localStorage.setItem(`${clave}:corrupto`, crudo);
    } catch {
      try { const crudo = localStorage.getItem(clave); if (crudo !== null) localStorage.setItem(`${clave}:corrupto`, crudo); } catch { /* sin almacenamiento */ }
    }
  }
  return nuevoEstado(m);
}
/** Devuelve false si no se pudo guardar (modo privado, cuota llena); la UI debe avisar. */
export function guardarMes(e: EstadoMes): boolean {
  avisarGuardado(`${CLAVE}:${e.mes}`, e);
  try { localStorage.setItem(`${CLAVE}:${e.mes}`, JSON.stringify(e)); return true; } catch { return false; }
}
