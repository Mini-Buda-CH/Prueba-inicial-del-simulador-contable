// Motor fiscal: importes en centavos; tasas en porcentaje (16 = 16 %).
export type RangoTarifa = { limite_inferior: number; limite_superior: number | null; cuota_fija: number; tasa_pct: number };
export type VigenciaSubsidio = { desde: string; hasta: string; limite_ingreso_mensual: number; uma_mensual: number; porcentaje_uma: number };

/** Rechaza capturas inválidas: los importes son centavos enteros no negativos. */
function monto(valor: number, nombre: string): number {
  if (!Number.isSafeInteger(valor) || valor < 0) throw new RangeError(`${nombre} inválido: ${valor} (se esperan centavos enteros ≥ 0)`);
  return valor;
}

// Tasa en diezmilésimas de punto (7.513 % → 75130) para conservar tres decimales (CEAV, cuotas IMSS); redondeo a centavo.
// Límite: centavos × 75130 cabe en un entero seguro hasta ~1.2e11 centavos.
export const aplicarTasa = (centavos: number, tasaPct: number) =>
  Math.round((monto(centavos, 'Base') * Math.round(tasaPct * 10000)) / 1000000);

/** Importe a pagar en pesos (art. 20 CFF): de 1 a 50 centavos se baja, de 51 a 99 se sube.
 * Es la regla para efectuar el pago; no describe el redondeo de cada campo de cada aplicativo. */
export const aPagarPesos = (centavos: number) => Math.floor(monto(centavos, 'Importe') / 100) + (centavos % 100 >= 51 ? 1 : 0);

/** ISR conforme a una tarifa (p. ej. art. 96 mensual). */
export function isrTarifa(base: number, tarifa: RangoTarifa[]): number {
  if (monto(base, 'Base') === 0) return 0;
  const r = tarifa.find((t) => base >= t.limite_inferior && (t.limite_superior === null || base <= t.limite_superior));
  if (!r) throw new Error(`Base ${base} fuera de la tarifa`);
  return r.cuota_fija + aplicarTasa(base - r.limite_inferior, r.tasa_pct);
}

/** Subsidio potencial del mes según la vigencia de la fecha (UMA mensual × porcentaje).
 * Supone que la elegibilidad del trabajador y el tipo de percepción ya se validaron: no es un motor integral de nómina.
 * La cuota 2026 sigue sujeta al pendiente P08 (535.65 vs 536.22). */
export function subsidioMensual(fecha: string, ingreso: number, vigencias: VigenciaSubsidio[]): number {
  const v = vigencias.find((x) => fecha >= x.desde && fecha <= x.hasta);
  if (!v) throw new Error(`Sin vigencia de subsidio para ${fecha}`);
  return monto(ingreso, 'Ingreso') > v.limite_ingreso_mensual ? 0 : aplicarTasa(v.uma_mensual, v.porcentaje_uma);
}

/** Retención de sueldos: el subsidio solo reduce el ISR, no se entrega como efectivo. Misma salvedad de elegibilidad. */
export function retencionSueldo(fecha: string, ingreso: number, tarifa: RangoTarifa[], vigencias: VigenciaSubsidio[]) {
  const isr = isrTarifa(ingreso, tarifa);
  const subsidio = Math.min(subsidioMensual(fecha, ingreso, vigencias), isr);
  return { isr, subsidio, retenido: isr - subsidio };
}

/** IVA del mes en base a flujo: trasladado cobrado (208-01) contra acreditable pagado (118-01). */
export function ivaDelMes(movs: { cuenta: string; cargo: number; abono: number }[]) {
  const saldo = (cuenta: string, signo: 1 | -1) =>
    movs.filter((m) => m.cuenta === cuenta).reduce((s, m) => s + signo * (m.cargo - m.abono), 0);
  const trasladado = saldo('SIM-208-01', -1);
  const acreditable = saldo('SIM-118-01', 1);
  return { trasladado, acreditable, aCargo: Math.max(trasladado - acreditable, 0), aFavor: Math.max(acreditable - trasladado, 0) };
}

export type TablaResico = { limite_inferior: number; limite_superior: number | null; tasa_pct: number }[];
export const LIMITE_RESICO_PF = 350000000; // 3,500,000.00 anuales (art. 113-E)

/** ISR mensual RESICO PF: tasa única sobre el total cobrado del mes (no por excedente), menos lo retenido por personas morales.
 * - base: ingresos cobrados menos descuentos/devoluciones procedentes y documentados.
 * - pagosAnteriores: solo pagos de la MISMA obligación y periodo (declaración complementaria), nunca ISR de otros meses.
 * - excedente: retención mayor al impuesto; es un resultado aritmético, no una devolución autorizada ni un saldo trasladable.
 * Arriba del último tramo legal se calcula al 2.5 % (extensión que muestra la guía del SAT) y se devuelve una alerta. */
export function isrResicoMensual(base: number, tabla: TablaResico, retenido = 0, pagosAnteriores = 0, acumuladoAnual = 0) {
  [base, retenido, pagosAnteriores, acumuladoAnual].forEach((v, i) => monto(v, ['Base', 'Retención', 'Pagos anteriores', 'Acumulado anual'][i]));
  const { tasa_pct, impuesto, excede } = tasaResico(base, tabla);
  const neto = impuesto - pagosAnteriores - retenido;
  const alerta = excede || acumuladoAnual + base > LIMITE_RESICO_PF ? ALERTA_LIMITE : undefined;
  return { tasa_pct, impuesto, retenido, aCargo: Math.max(neto, 0), excedente: Math.max(-neto, 0), ...(alerta && { alerta }) };
}

const ALERTA_LIMITE = 'Los ingresos superan el límite de $3,500,000 del régimen: revisar la permanencia en RESICO.';

/** Tasa del tramo (sin escalonar). Arriba del último tramo legal usa su tasa y marca excede. */
function tasaResico(base: number, tabla: TablaResico) {
  const ultimo = tabla[tabla.length - 1];
  const excede = base > ultimo.limite_superior!;
  const fila = base === 0 ? undefined : excede ? ultimo : tabla.find((r) => base >= r.limite_inferior && base <= r.limite_superior!);
  if (base > 0 && !fila) throw new RangeError(`Base ${base} fuera de la tabla RESICO`);
  const tasa_pct = fila?.tasa_pct ?? 0;
  return { tasa_pct, impuesto: aplicarTasa(base, tasa_pct), excede };
}

/** ISR anual RESICO PF (art. 113-F): tasa única sobre el total anual cobrado, menos los pagos mensuales
 * EFECTIVAMENTE PAGADOS y las retenciones del art. 113-J. Aquí sí puede resultar un impuesto a favor (devolución o compensación). */
export function isrResicoAnual(base: number, tablaAnual: TablaResico, pagosMensuales: number, retenido = 0) {
  [base, pagosMensuales, retenido].forEach((v, i) => monto(v, ['Base', 'Pagos mensuales', 'Retención'][i]));
  const { tasa_pct, impuesto: causado, excede } = tasaResico(base, tablaAnual);
  const neto = causado - pagosMensuales - retenido;
  return { tasa_pct, causado, pagosMensuales, retenido, aCargo: Math.max(neto, 0), aFavor: Math.max(-neto, 0), ...(excede && { alerta: ALERTA_LIMITE }) };
}

/** Retención que hace una persona moral a una PF en RESICO (porcentaje sobre el monto sin IVA). */
export const retencionResico = (monto: number, pct: number) => aplicarTasa(monto, pct);
