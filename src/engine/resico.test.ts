import { describe, expect, it } from 'vitest';
import casos from '../../content/casos_resico.json';
import params from '../../content/parametros/2026.json';
import { isrResicoMensual, retencionResico, type TablaResico } from './fiscal';

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
        'Tasa aplicable %': Math.round(r.tasa_pct * 100), 'Impuesto mensual': r.impuesto, 'Impuesto a cargo': r.aCargo,
        'Impuesto a favor': r.aFavor, 'Base gravable': base, 'ISR retenido por la persona moral': r.retenido, 'Total de ingresos cobrados': c.datos.cobrado,
      };
      for (const res of c.resultados) expect(res.valor, res.concepto).toBe(esperado[res.concepto]);
    });
  }
});
