// Contenido de la Academia. Cada ejercicio apunta a una póliza de content/casos.json.
export type Ejercicio = { id: string; caso: string; poliza: string };
export type Leccion = { id: string; modulo: string; titulo: string; teoria: string[]; ejercicios: Ejercicio[] };

export const lecciones: Leccion[] = [
  {
    id: 'M1-L01',
    modulo: 'Módulo 1 · Fundamentos',
    titulo: 'Partida doble: tu primera póliza',
    teoria: [
      'Toda operación afecta al menos dos cuentas: lo que se carga en unas se abona en otras, por el mismo importe total.',
      'Las cuentas de naturaleza deudora (activo, costos, gastos) aumentan con cargos; las acreedoras (pasivo, capital, ingresos) aumentan con abonos.',
      'En una venta o compra gravada, el IVA va en su propia cuenta: trasladado cobrado si es venta y acreditable pagado si es compra.',
      'Una póliza solo es válida si cargos = abonos y cada renglón lleva cargo o abono, nunca ambos.',
    ],
    ejercicios: [
      { id: 'M1-L01-E1', caso: 'C01', poliza: 'P01' },
      { id: 'M1-L01-E2', caso: 'C02', poliza: 'P01' },
      { id: 'M1-L01-E3', caso: 'C03', poliza: 'P01' },
    ],
  },
];
export const totalEjercicios = lecciones.reduce((n, l) => n + l.ejercicios.length, 0);
