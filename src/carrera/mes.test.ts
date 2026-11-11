import { describe, expect, it } from 'vitest';
import casos from '../../content/casos.json';
import { balanza, type Cuenta } from '../engine/contable';
import catalogo from '../../content/catalogo.json';
import { ivaDelMes } from '../engine/fiscal';
import { lecciones } from '../lecciones';
import { evaluar, libroSolucion, MES, nuevoEstado, precargados, presentarDeclaracion, registrarPoliza, solucionTarea, sumarDias } from './estado';

const cat = catalogo as Cuenta[];

describe('mes PyME febrero 2026', () => {
  it('cada tarea apunta a una lección existente y a una póliza existente', () => {
    for (const t of MES.tareas) {
      expect(lecciones.some((l) => l.id === t.leccion), t.id).toBe(true);
      if (t.tipo === 'poliza') expect(solucionTarea(t).length, t.id).toBeGreaterThan(1);
    }
  });

  it('el libro correcto deja saldos coherentes (calculados a mano)', () => {
    const s = balanza(libroSolucion(), cat);
    // 100,000 − 2×1,160 − 23,200 − 5,800 + 34,800 + 5,800 − 5,800 − 13,920 − 27,840 + 1,160
    expect(s.get('SIM-102-01')?.saldo).toBe(6288000);
    // 20,000 + 10,000 − 18,000 − 6,000 + 3,000
    expect(s.get('SIM-115-01')?.saldo).toBe(900000);
    // Ninguna cuenta queda con saldo contrario a su naturaleza
    for (const [cuenta, v] of s) expect(v.saldo, cuenta).toBeGreaterThanOrEqual(0);
  });

  it('IVA del mes: saldo a favor de 5,120; sin corregir el duplicado sería 5,280', () => {
    expect(ivaDelMes(libroSolucion())).toEqual({ trasladado: 480000, acreditable: 992000, aCargo: 0, aFavor: 512000 });
    const sinCorreccion = libroSolucion().filter((m) => m.poliza !== 'T16');
    expect(ivaDelMes(sinCorreccion).aFavor).toBe(528000);
  });

  it('jugar perfecto da todas las dimensiones en verde', () => {
    let e = nuevoEstado();
    for (const t of MES.tareas.filter((t) => t.tipo === 'poliza')) e = registrarPoliza(e, t, solucionTarea(t));
    e = presentarDeclaracion(e, MES.tareas.find((t) => t.tipo === 'declaracion')!, ivaDelMes(e.movimientos));
    e = { ...e, tareas: { ...e.tareas, T20: { ok: true, fecha: '2026-03-11' } } };
    expect(evaluar(e)).toEqual({ registro: { correctas: 18, total: 18 }, control: true, cumplimiento: true, fiscal: { correcta: true, coherente: true }, comunicacion: true });
  });

  it('un error de registro se arrastra: declaración coherente con su libro pero incorrecta; retraso vence el plazo', () => {
    let e = { ...nuevoEstado(), retraso: 8 };
    const control = MES.tareas.find((t) => t.control)!;
    for (const t of MES.tareas.filter((t) => t.tipo === 'poliza' && t !== control)) e = registrarPoliza(e, t, solucionTarea(t));
    // En vez de revertir el duplicado, el jugador registra otra cosa que cuadra
    e = registrarPoliza(e, control, [{ poliza: 'x', cuenta: 'SIM-601-84', cargo: 100, abono: 0 }, { poliza: 'x', cuenta: 'SIM-102-01', cargo: 0, abono: 100 }]);
    e = presentarDeclaracion(e, MES.tareas.find((t) => t.tipo === 'declaracion')!, ivaDelMes(e.movimientos));
    const ev = evaluar(e);
    expect(ev.control).toBe(false);
    expect(ev.fiscal).toEqual({ correcta: false, coherente: true });
    expect(e.declaracion?.fecha).toBe('2026-03-18');
    expect(ev.cumplimiento).toBe(false);
  });

  it('precarga el duplicado y suma días cruzando de mes', () => {
    expect(precargados().filter((m) => m.cuenta === 'SIM-601-55')).toHaveLength(2);
    expect(sumarDias('2026-02-27', 3)).toBe('2026-03-02');
  });
});

describe('lecciones', () => {
  it('cada ejercicio de cálculo apunta a un resultado existente', () => {
    for (const l of lecciones) for (const ej of l.ejercicios) {
      if (ej.tipo === 'calculo') expect(casos.find((c) => c.id === ej.caso)?.resultados.some((r) => r.concepto === ej.concepto), ej.id).toBe(true);
      if (ej.tipo === 'poliza') expect(casos.find((c) => c.id === ej.caso)?.movimientos.some((m) => m.poliza === ej.poliza), ej.id).toBe(true);
      if (ej.tipo === 'opcion') expect(ej.correcta).toBeLessThan(ej.opciones.length);
    }
  });
  it('ids únicos', () => {
    const ids = lecciones.flatMap((l) => [l.id, ...l.ejercicios.map((e) => e.id)]);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
