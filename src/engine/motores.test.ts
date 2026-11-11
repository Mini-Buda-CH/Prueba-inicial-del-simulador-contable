import { describe, expect, it } from 'vitest';
import casos from '../../content/casos.json';
import catalogo from '../../content/catalogo.json';
import params from '../../content/parametros/2026.json';
import { balanza, mismaPoliza, validarPoliza, type Cuenta, type Movimiento } from './contable';
import { isrTarifa, retencionSueldo, subsidioMensual, type RangoTarifa } from './fiscal';

const cat = catalogo as Cuenta[];
const tarifa = params.isr_mensual_art96 as RangoTarifa[];
const resultado = (id: string, concepto: string) =>
  casos.find((c) => c.id === id)!.resultados.find((r) => r.concepto === concepto)!.valor;

describe('casos del paquete v0.1', () => {
  for (const caso of casos) {
    it(`${caso.id} ${caso.titulo}: cada póliza cuadra`, () => {
      const polizas = Object.groupBy(caso.movimientos as Movimiento[], (m) => m.poliza);
      for (const movs of Object.values(polizas)) expect(validarPoliza(movs!, cat)).toEqual([]);
    });
  }

  it('C14 PEPS: costo de ventas 1,240', () => {
    const movs = casos.find((c) => c.id === 'C14')!.movimientos as Movimiento[];
    expect(balanza(movs, cat).get('SIM-501-01')?.saldo).toBe(124000);
  });

  it('C08 deja la diferencia de 1,000 sin forzarla a cero', () => {
    expect(resultado('C08', 'Libro ajustado') - resultado('C08', 'Banco conciliado 47620+5000-3000')).toBe(100000);
    expect(resultado('C08', 'Diferencia pendiente')).toBe(100000);
  });
});

describe('validarPoliza', () => {
  it('detecta descuadre, cuenta inexistente y renglón con cargo y abono', () => {
    const errores = validarPoliza(
      [
        { poliza: 'P', cuenta: 'SIM-102-01', cargo: 100, abono: 100 },
        { poliza: 'P', cuenta: 'NO-EXISTE', cargo: 0, abono: 50 },
      ],
      cat,
    );
    expect(errores.join(' ')).toMatch(/no existe/);
    expect(errores.join(' ')).toMatch(/no ambos/);
    expect(errores.join(' ')).toMatch(/No cuadra/);
  });
  it('compara pólizas sin importar el orden', () => {
    const a = { poliza: 'P', cuenta: 'X', cargo: 1, abono: 0 };
    const b = { poliza: 'P', cuenta: 'Y', cargo: 0, abono: 1 };
    expect(mismaPoliza([a, b], [b, a])).toBe(true);
  });
});

describe('ISR art. 96 y subsidio 2026', () => {
  it('tarifa sin huecos de un centavo entre rangos', () => {
    tarifa.slice(1).forEach((r, i) => expect(r.limite_inferior).toBe(tarifa[i].limite_superior! + 1));
  });
  it('C11: 15,000 -> ISR 1,402.82 sin subsidio', () => {
    expect(retencionSueldo('2026-02-28', 1500000, tarifa, params.subsidio)).toEqual({ isr: 140282, subsidio: 0, retenido: 140282 });
    expect(resultado('C11', 'ISR')).toBe(140282);
  });
  it('C12: 10,000 en febrero -> ISR 729.02, subsidio 535.65, retenido 193.37', () => {
    expect(retencionSueldo('2026-02-28', 1000000, tarifa, params.subsidio)).toEqual({ isr: 72902, subsidio: 53565, retenido: 19337 });
    expect(resultado('C12', 'ISR retenido')).toBe(19337);
  });
  it('subsidio de enero usa la UMA anterior (536.21)', () => {
    expect(subsidioMensual('2026-01-31', 1000000, params.subsidio)).toBe(53621);
  });
  it('límites de rango: inferior y superior del rango 2', () => {
    expect(isrTarifa(84460, tarifa)).toBe(1622);
    expect(isrTarifa(716851, tarifa)).toBe(1622 + Math.round(((716851 - 84460) * 640) / 10000));
  });
});
