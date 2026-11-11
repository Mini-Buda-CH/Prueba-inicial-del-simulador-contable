// Estado y reglas del mes de Carrera. Funciones puras (probadas en mes.test.ts) + persistencia local.
import casos from '../../content/casos.json';
import mes from '../../content/carrera/pyme-feb-2026.json';
import { mismaPoliza, type Movimiento } from '../engine/contable';
import { ivaDelMes } from '../engine/fiscal';

export type Tarea = {
  id: string; fecha: string; tipo: 'poliza' | 'declaracion' | 'mensaje'; leccion: string; correo: string;
  caso?: string; poliza?: string; control?: boolean;
  pregunta?: string; opciones?: string[]; correcta?: number; explicacion?: string;
};
export const MES = mes as Omit<typeof mes, 'tareas'> & { tareas: Tarea[] };
export type Iva = ReturnType<typeof ivaDelMes>;
export type EstadoMes = {
  version: 1; mes: string; retraso: number;
  tareas: Record<string, { ok: boolean; fecha: string }>;
  movimientos: Movimiento[];
  declaracion?: Iva & { fecha: string };
};

export const precargados = (): Movimiento[] =>
  MES.precargados.polizas.flatMap((p, i) => p.map((m) => ({ ...m, poliza: `PRE-${i + 1}` })));

export const solucionTarea = (t: Tarea): Movimiento[] =>
  (casos.find((c) => c.id === t.caso)!.movimientos as Movimiento[])
    .filter((m) => m.poliza === t.poliza)
    .map((m) => ({ ...m, poliza: t.id }));

/** Libro como debería quedar si todo se registra bien. */
export const libroSolucion = (): Movimiento[] => [...precargados(), ...MES.tareas.filter((t) => t.tipo === 'poliza').flatMap(solucionTarea)];

export const nuevoEstado = (): EstadoMes => ({ version: 1, mes: MES.id, retraso: 0, tareas: {}, movimientos: precargados() });

export function sumarDias(fecha: string, dias: number) {
  const d = new Date(`${fecha}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

export const tareaActual = (e: EstadoMes) => MES.tareas.find((t) => !e.tareas[t.id]);

/** Registra una póliza del jugador (cuadrada) y si coincide con la solución. */
export function registrarPoliza(e: EstadoMes, t: Tarea, movs: Movimiento[]): EstadoMes {
  const propios = movs.map((m) => ({ ...m, poliza: t.id }));
  return {
    ...e,
    movimientos: [...e.movimientos, ...propios],
    tareas: { ...e.tareas, [t.id]: { ok: mismaPoliza(propios, solucionTarea(t)), fecha: sumarDias(t.fecha, e.retraso) } },
  };
}

export function presentarDeclaracion(e: EstadoMes, t: Tarea, declarada: Iva): EstadoMes {
  const fecha = sumarDias(t.fecha, e.retraso);
  const ok = JSON.stringify(declarada) === JSON.stringify(ivaDelMes(libroSolucion()));
  return { ...e, declaracion: { ...declarada, fecha }, tareas: { ...e.tareas, [t.id]: { ok, fecha } } };
}

export function evaluar(e: EstadoMes) {
  const polizas = MES.tareas.filter((t) => t.tipo === 'poliza');
  const control = MES.tareas.find((t) => t.control)!;
  const mensaje = MES.tareas.find((t) => t.tipo === 'mensaje')!;
  const decl = e.declaracion;
  const igual = (a: Iva, b: Iva) => a.trasladado === b.trasladado && a.acreditable === b.acreditable && a.aCargo === b.aCargo && a.aFavor === b.aFavor;
  return {
    registro: { correctas: polizas.filter((t) => e.tareas[t.id]?.ok).length, total: polizas.length },
    control: !!e.tareas[control.id]?.ok,
    cumplimiento: !!decl && decl.fecha <= MES.vencimiento_iva,
    fiscal: { correcta: !!decl && igual(decl, ivaDelMes(libroSolucion())), coherente: !!decl && igual(decl, ivaDelMes(e.movimientos)) },
    comunicacion: !!e.tareas[mensaje.id]?.ok,
  };
}

const CLAVE = 'simcont.carrera.v1';
export function cargarMes(): EstadoMes {
  try {
    const e = JSON.parse(localStorage.getItem(CLAVE) ?? 'null');
    if (e?.version === 1 && e.mes === MES.id) return e;
  } catch { /* almacenamiento no disponible o dañado: empezar el mes de nuevo */ }
  return nuevoEstado();
}
export function guardarMes(e: EstadoMes) {
  try { localStorage.setItem(CLAVE, JSON.stringify(e)); } catch { /* modo privado: el mes vive solo en memoria */ }
}
