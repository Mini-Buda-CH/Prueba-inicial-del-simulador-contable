// Motor contable: importes siempre en centavos (enteros).
export type Movimiento = { poliza: string; cuenta: string; cargo: number; abono: number };
export type Cuenta = { cuenta: string; nombre: string; agrupador: string; naturaleza: 'D' | 'A'; estado: string };

/** Errores de una póliza; lista vacía = válida. */
export function validarPoliza(movs: Movimiento[], catalogo: Cuenta[]): string[] {
  const errores: string[] = [];
  const existe = new Set(catalogo.map((c) => c.cuenta));
  if (movs.length < 2) errores.push('Una póliza necesita al menos dos movimientos.');
  movs.forEach((m, i) => {
    if (!existe.has(m.cuenta)) errores.push(`Renglón ${i + 1}: la cuenta "${m.cuenta}" no existe en el catálogo.`);
    if (!Number.isInteger(m.cargo) || !Number.isInteger(m.abono) || m.cargo < 0 || m.abono < 0)
      errores.push(`Renglón ${i + 1}: importes inválidos.`);
    else if ((m.cargo > 0) === (m.abono > 0)) errores.push(`Renglón ${i + 1}: lleva cargo o abono, no ambos ni ninguno.`);
  });
  const cargos = movs.reduce((s, m) => s + m.cargo, 0);
  const abonos = movs.reduce((s, m) => s + m.abono, 0);
  if (cargos !== abonos) errores.push(`No cuadra: cargos ${pesos(cargos)} ≠ abonos ${pesos(abonos)}.`);
  return errores;
}

/** Saldo por cuenta según su naturaleza (deudora: cargos − abonos). */
export function balanza(movs: Movimiento[], catalogo: Cuenta[]) {
  const nat = new Map(catalogo.map((c) => [c.cuenta, c.naturaleza]));
  const saldos = new Map<string, { cargos: number; abonos: number; saldo: number }>();
  for (const m of movs) {
    const s = saldos.get(m.cuenta) ?? { cargos: 0, abonos: 0, saldo: 0 };
    s.cargos += m.cargo;
    s.abonos += m.abono;
    s.saldo = nat.get(m.cuenta) === 'A' ? s.abonos - s.cargos : s.cargos - s.abonos;
    saldos.set(m.cuenta, s);
  }
  return saldos;
}

/** ¿Coinciden los movimientos del alumno con la solución? (sin importar el orden) */
export function mismaPoliza(alumno: Movimiento[], solucion: Movimiento[]): boolean {
  const clave = (ms: Movimiento[]) => ms.map((m) => `${m.cuenta}|${m.cargo}|${m.abono}`).sort().join(';');
  return clave(alumno) === clave(solucion);
}

export const pesos = (c: number) =>
  (c / 100).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
