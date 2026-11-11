import { describe, expect, it } from 'vitest';
import casosPm from '../../content/casos.json';
import casosResico from '../../content/casos_resico.json';
import { balanza, type Cuenta } from '../engine/contable';
import catalogo from '../../content/catalogo.json';
import { ivaDelMes } from '../engine/fiscal';
import { lecciones } from '../lecciones';
import { declaracionCorrecta, evaluar, libroSolucion, MES, MESES, nuevoEstado, precargados, presentarDeclaracion, registrarPoliza, resolver, solucionTarea, sumarDias, type Resico } from './estado';

const casos = [...casosPm, ...casosResico];

const cat = catalogo as Cuenta[];

describe('mes PyME febrero 2026', () => {
  it('cada tarea apunta a una lección existente y a una póliza existente', () => {
    for (const t of MESES.flatMap((m) => m.tareas)) {
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

  it('el estado de la Fase 1 sin sufijo de mes se sigue entendiendo', () => {
    expect(nuevoEstado().mes).toBe('pyme-feb-2026');
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

describe('revisión del usuario (datos/revisiones)', () => {
  it('la balanza del mes coincide renglón por renglón con la balanza reconstruida', async () => {
    const rev = (await import('../../datos/revisiones/revision_inicial_pyme_febrero_2026.json')).balanza_deudor_menos_acreedor as Record<string, number>;
    const propia: Record<string, number> = {};
    for (const [cuenta, s] of balanza(libroSolucion(), cat)) {
      const agr = cat.find((c) => c.cuenta === cuenta)!.agrupador;
      if (s.cargos - s.abonos !== 0) propia[agr] = s.cargos - s.abonos;
    }
    expect(propia).toEqual(rev);
  });

  it('C10: la depreciación mensual corresponde a MOI / vida útil del enunciado', () => {
    const c10 = casos.find((c) => c.id === 'C10')!;
    const meses = Number(/(\d+) meses/.exec(c10.enunciado)![1]);
    expect(c10.resultados.find((r) => r.concepto === 'Depreciación contable mensual')!.valor).toBe(2400000 / meses);
  });
});

describe('mes RESICO marzo 2026', () => {
  const m = MESES.find((x) => x.id === 'resico-mar-2026')!;
  it('declaración correcta: base 55,000 al 1.5 % = 825, menos 500 retenidos = 325 a cargo', () => {
    expect(declaracionCorrecta(m)).toEqual({ cobrado: 6000000, devoluciones: 500000, tasa_pct: 1.5, impuesto: 82500, retenido: 50000, aCargo: 32500, aFavor: 0 });
  });
  it('jugar perfecto: todo en verde y control no aplica', () => {
    let e = nuevoEstado(m);
    for (const t of m.tareas.filter((t) => t.tipo !== 'declaracion')) e = resolver(e, t, true);
    e = presentarDeclaracion(e, m.tareas.find((t) => t.tipo === 'declaracion')!, declaracionCorrecta(m));
    expect(evaluar(e)).toEqual({ registro: { correctas: 3, total: 3 }, control: null, cumplimiento: true, fiscal: { correcta: true, coherente: null }, comunicacion: true });
  });
  it('declarar el PPD no cobrado da una declaración incorrecta', () => {
    const mal = { ...(declaracionCorrecta(m) as Resico), cobrado: 7500000 };
    const e = presentarDeclaracion(nuevoEstado(m), m.tareas.find((t) => t.tipo === 'declaracion')!, mal);
    expect(evaluar(e).fiscal.correcta).toBe(false);
  });
  it('sin precargados ni pólizas', () => {
    expect(precargados(m)).toEqual([]);
  });
});
