// Cotejo automático de parámetros contra el TEXTO de la LISR (datos/referencias/leyes/LISR.md, última reforma DOF 01-04-2024).
import { describe, expect, it } from 'vitest';
import lisr from '../../datos/referencias/leyes/LISR.md?raw';
import params from '../../content/parametros/2026.json';

const articulo = (num: string, siguiente: string) => lisr.slice(lisr.indexOf(`Artículo ${num}.`), lisr.indexOf(`Artículo ${siguiente}.`));
const pesos = (c: number) => (c / 100).toLocaleString('en-US', { minimumFractionDigits: 2 });

describe('cotejo contra el texto de la LISR', () => {
  it('versión del texto', () => expect(lisr).toContain('Última reforma publicada DOF 01-04-2024'));

  it('art. 113-E: tabla mensual RESICO (5 tramos)', () => {
    const art = articulo('113-E', '113-F');
    for (const r of params.resico_pf_mensual.tabla) expect(art).toContain(`Hasta ${pesos(r.limite_superior)} ${r.tasa_pct.toFixed(2)}%`);
  });

  it('art. 113-F: tabla anual RESICO (5 tramos)', () => {
    const art = articulo('113-F', '113-G');
    for (const r of params.resico_pf_anual.tabla) expect(art).toContain(`Hasta ${pesos(r.limite_superior)} ${r.tasa_pct.toFixed(2)}%`);
  });

  it('art. 113-J: retención de 1.25 %', () => {
    expect(articulo('113-J', '114').replace(/\s+/g, ' ')).toContain(`tasa del ${params.resico_pf_mensual.retencion_pm_pct}%`); // el texto parte la línea
  });

  it('art. 34: porcentajes máximos de depreciación del paquete v0.1', () => {
    const art = articulo('34', '35');
    for (const inv of params.solo_referencia.inversiones_lisr) {
      const [, fraccion, inciso] = (inv.articulo as string).split(' ');
      // Desde el inicio de la fracción hasta la siguiente; si hay inciso, se busca dentro de ella.
      const ini = art.search(new RegExp(`\\n${fraccion}\\. `));
      expect(ini, inv.articulo).toBeGreaterThan(-1);
      const resto = art.slice(ini + 1);
      const bloque = resto.slice(0, (resto.slice(1).search(/\n[IVX]+\. /) + 1) || undefined);
      const texto = inciso ? bloque.slice(bloque.indexOf(`\n${inciso}) `)) : bloque;
      expect(texto.match(/(\d+)%/)?.[1], inv.articulo).toBe(String(inv.maximo_anual_pct));
    }
  });
});
