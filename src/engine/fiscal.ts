// Motor fiscal: importes en centavos; tasas en porcentaje (16 = 16 %).
export type RangoTarifa = { limite_inferior: number; limite_superior: number | null; cuota_fija: number; tasa_pct: number };
export type VigenciaSubsidio = { desde: string; hasta: string; limite_ingreso_mensual: number; uma_mensual: number; porcentaje_uma: number };

// Producto entero con la tasa en centésimas de punto para evitar errores de coma flotante; redondeo a centavo.
const aplicarTasa = (centavos: number, tasaPct: number) => Math.round((centavos * Math.round(tasaPct * 100)) / 10000);

/** ISR conforme a una tarifa (p. ej. art. 96 mensual). */
export function isrTarifa(base: number, tarifa: RangoTarifa[]): number {
  if (base <= 0) return 0;
  const r = tarifa.find((t) => base >= t.limite_inferior && (t.limite_superior === null || base <= t.limite_superior));
  if (!r) throw new Error(`Base ${base} fuera de la tarifa`);
  return r.cuota_fija + aplicarTasa(base - r.limite_inferior, r.tasa_pct);
}

/** Subsidio potencial del mes según la vigencia de la fecha (UMA mensual × porcentaje). */
export function subsidioMensual(fecha: string, ingreso: number, vigencias: VigenciaSubsidio[]): number {
  const v = vigencias.find((x) => fecha >= x.desde && fecha <= x.hasta);
  if (!v) throw new Error(`Sin vigencia de subsidio para ${fecha}`);
  return ingreso > v.limite_ingreso_mensual ? 0 : aplicarTasa(v.uma_mensual, v.porcentaje_uma);
}

/** Retención de sueldos: el subsidio solo reduce el ISR, no se entrega como efectivo. */
export function retencionSueldo(fecha: string, ingreso: number, tarifa: RangoTarifa[], vigencias: VigenciaSubsidio[]) {
  const isr = isrTarifa(ingreso, tarifa);
  const subsidio = Math.min(subsidioMensual(fecha, ingreso, vigencias), isr);
  return { isr, subsidio, retenido: isr - subsidio };
}
