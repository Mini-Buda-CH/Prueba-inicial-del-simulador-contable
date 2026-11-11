import { describe, expect, it } from 'vitest';
import casos from '../../content/casos_resico.json';
import params from '../../content/parametros/2026.json';
import { aPagarPesos, aplicarTasa, isrResicoMensual, isrTarifa, retencionResico, type TablaResico } from './fiscal';

const tabla = params.resico_pf_mensual.tabla as TablaResico;

describe('RESICO PF mensual', () => {
  it('tabla sin huecos entre rangos', () => {
    tabla.slice(1).forEach((r, i) => expect(r.limite_inferior).toBe(tabla[i].limite_superior! + 1));
  });
  it('fronteras: 25,000.00 al 1 %; 25,000.01 al 1.1 %; ejemplo de la guía 500,000 → 12,500', () => {
    expect(isrResicoMensual(2500000, tabla).impuesto).toBe(25000);
    expect(isrResicoMensual(2500001, tabla).tasa_pct).toBe(1.1);
    expect(isrResicoMensual(50000000, tabla).impuesto).toBe(1250000);
    expect(isrResicoMensual(0, tabla).impuesto).toBe(0);
  });
  it('retención de 1.25 % sobre 40,000 = 500', () => {
    expect(retencionResico(4000000, params.resico_pf_mensual.retencion_pm_pct)).toBe(50000);
  });
  for (const c of casos) {
    it(`${c.id}: los resultados redactados coinciden con el motor`, () => {
      const base = c.datos.cobrado - c.datos.devoluciones;
      const r = isrResicoMensual(base, tabla, c.datos.retenido);
      const esperado: Record<string, number> = {
        'Tasa aplicable %': r.tasa_pct, 'Impuesto mensual': r.impuesto, 'Impuesto a cargo': r.aCargo,
        'Excedente de retenciones (aritmético)': r.excedente, 'Base gravable': base, 'ISR retenido por la persona moral': r.retenido, 'Total de ingresos cobrados': c.datos.cobrado,
      };
      for (const res of c.resultados) expect(res.valor, res.concepto).toBe(esperado[res.concepto]);
    });
  }
});

describe('revisión v0.2', () => {
  it('V01: tabla legal de 5 tramos hasta 3,500,000; arriba calcula al 2.5 % con alerta', () => {
    expect(tabla).toHaveLength(5);
    expect(tabla[4].limite_superior).toBe(350000000);
    expect(isrResicoMensual(350000000, tabla).alerta).toBeUndefined();
    const arriba = isrResicoMensual(350000001, tabla);
    expect(arriba.tasa_pct).toBe(2.5);
    expect(arriba.alerta).toMatch(/3,500,000/);
    expect(isrResicoMensual(100000000, tabla, 0, 0, 300000000).alerta).toMatch(/permanencia/);
  });
  it('V01: recálculo independiente del revisor (CSV) coincide', () => {
    const csv: [number, number, number, number, number][] = [ // base, retenido, ISR, a cargo, excedente (centavos)
      [1800000, 0, 18000, 18000, 0], [4000000, 50000, 44000, 0, 6000], [2500000, 0, 25000, 25000, 0],
      [6000000, 50000, 90000, 40000, 0], [5500000, 50000, 82500, 32500, 0]];
    for (const [base, ret, isr, cargo, exc] of csv) expect(isrResicoMensual(base, tabla, ret)).toMatchObject({ impuesto: isr, aCargo: cargo, excedente: exc });
  });
  it('V06: pago en pesos según art. 20 CFF (.50 baja, .51 sube)', () => {
    expect(aPagarPesos(32550)).toBe(325);
    expect(aPagarPesos(32551)).toBe(326);
    expect(aPagarPesos(32501)).toBe(325);
    expect(aPagarPesos(32500)).toBe(325);
    expect(aPagarPesos(0)).toBe(0);
  });
  it('V07: tasas de tres decimales no pierden precisión', () => {
    expect(aplicarTasa(1000000, 7.513)).toBe(75130); // 10,000.00 × 7.513 % = 751.30
    expect(aplicarTasa(1000000, 0.375)).toBe(3750);  // 10,000.00 × 0.375 % = 37.50
    expect(aplicarTasa(100000000, 1.25)).toBe(1250000);
  });
  it('V09: rechaza NaN, infinitos, fraccionarios y negativos', () => {
    for (const malo of [NaN, Infinity, 10.5, -1]) {
      expect(() => isrResicoMensual(malo, tabla)).toThrow(RangeError);
      expect(() => isrTarifa(malo, params.isr_mensual_art96)).toThrow(RangeError);
      expect(() => aPagarPesos(malo)).toThrow(RangeError);
    }
    expect(() => isrResicoMensual(100, tabla, -5)).toThrow(RangeError);
  });
});
