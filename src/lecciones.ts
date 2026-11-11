// Contenido de la Academia. Los ejercicios apuntan a content/casos.json (pólizas y resultados)
// o a los XML sintéticos del paquete (datos/originales/.../04_xml).
export type Ejercicio =
  | { id: string; tipo: 'poliza'; caso: string; poliza: string }
  | { id: string; tipo: 'calculo'; caso: string; concepto: string; pregunta: string }
  | { id: string; tipo: 'opcion'; pregunta: string; opciones: string[]; correcta: number; explicacion: string; caso?: string; xml?: string };

export type Leccion = {
  id: string;
  modulo: string;
  titulo: string;
  teoria: string[];
  ejercicios: Ejercicio[];
  examen?: boolean;
  estado: 'PENDIENTE_VALIDACION' | 'VALIDADO';
};

const M1 = 'Módulo 1 · Fundamentos';
const M2 = 'Módulo 2 · Documentación fiscal';
const M3 = 'Módulo 3 · Personas físicas';
const P = 'PENDIENTE_VALIDACION' as const;

export const lecciones: Leccion[] = [
  {
    id: 'M1-L01', modulo: M1, estado: P, titulo: 'Partida doble: tu primera póliza',
    teoria: [
      'Toda operación afecta al menos dos cuentas: lo que se carga en unas se abona en otras, por el mismo importe total.',
      'Las cuentas de naturaleza deudora (activo, costos, gastos) aumentan con cargos; las acreedoras (pasivo, capital, ingresos) aumentan con abonos.',
      'En las operaciones gravadas de este módulo, registra el IVA por separado. Distingue el trasladado cobrado del pendiente de cobro, y el acreditable pagado del pendiente de pago. El acreditamiento exige además cumplir los requisitos fiscales aplicables; pagar una compra no basta por sí solo.',
      'Una póliza debe cuadrar y cada renglón debe contener cargo o abono, no ambos. Estas comprobaciones son necesarias, pero no sustituyen revisar cuentas, importes, soporte y tratamiento contable.',
    ],
    ejercicios: [
      { id: 'M1-L01-E1', tipo: 'poliza', caso: 'C01', poliza: 'P01' },
      { id: 'M1-L01-E2', tipo: 'poliza', caso: 'C02', poliza: 'P01' },
      { id: 'M1-L01-E3', tipo: 'poliza', caso: 'C03', poliza: 'P01' },
    ],
  },
  {
    id: 'M1-L02', modulo: M1, estado: P, titulo: 'Crédito: cobros y pagos parciales',
    teoria: [
      'En una venta a crédito el IVA nace como "trasladado no cobrado". Solo al cobrar se convierte en "trasladado cobrado", en proporción a lo cobrado.',
      'En una compra a crédito el IVA queda "pendiente de pago" y pasa a "acreditable pagado" en la proporción efectivamente pagada.',
      'El cobro o el pago son una póliza; la reclasificación del IVA es otra. Así el libro refleja cuánto IVA ya es exigible o acreditable en el mes.',
      'En este simulador el cobro o pago y la reclasificación del IVA se registran en pólizas separadas para facilitar el aprendizaje. Esta separación es una convención del ejercicio.',
    ],
    ejercicios: [
      { id: 'M1-L02-E1', tipo: 'poliza', caso: 'C04', poliza: 'P01' },
      { id: 'M1-L02-E2', tipo: 'poliza', caso: 'C04', poliza: 'P04' },
      { id: 'M1-L02-E3', tipo: 'poliza', caso: 'C05', poliza: 'P01' },
      { id: 'M1-L02-E4', tipo: 'poliza', caso: 'C05', poliza: 'P03' },
      { id: 'M1-L02-E5', tipo: 'calculo', caso: 'C04', concepto: 'Clientes pendiente', pregunta: '¿Cuánto queda pendiente de cobro en Clientes?' },
    ],
  },
  {
    id: 'M1-L03', modulo: M1, estado: P, titulo: 'Devoluciones y pagos anticipados',
    teoria: [
      'Una devolución de venta se registra en su propia cuenta (devoluciones sobre ventas), no restando directamente a ventas, y revierte el IVA trasladado correspondiente.',
      'Si la mercancía regresa en condiciones de venta, también se revierte su costo: vuelve al inventario.',
      'Un pago anticipado (como un seguro anual) es un activo: se reconoce como gasto mes a mes, conforme se recibe el beneficio.',
    ],
    ejercicios: [
      { id: 'M1-L03-E1', tipo: 'poliza', caso: 'C06', poliza: 'P01' },
      { id: 'M1-L03-E2', tipo: 'poliza', caso: 'C06', poliza: 'P02' },
      { id: 'M1-L03-E3', tipo: 'poliza', caso: 'C07', poliza: 'P01' },
      { id: 'M1-L03-E4', tipo: 'poliza', caso: 'C07', poliza: 'P02' },
    ],
  },
  {
    id: 'M1-L04', modulo: M1, estado: P, titulo: 'Activos fijos y depreciación',
    teoria: [
      'El equipo que se usará más de un periodo se registra como activo (monto original de la inversión) y su costo se distribuye con la depreciación.',
      'La depreciación contable sigue la vida útil estimada; la deducción fiscal usa los porcentajes máximos de la LISR (art. 34). Son cálculos distintos y conviven.',
      'La depreciación se abona a una cuenta complementaria (depreciación acumulada), nunca directamente al activo.',
      'El caso supone que el equipo está disponible para uso desde su adquisición. Para este ejercicio se utilizan costo de $24,000, valor residual cero y vida útil de 30 meses: la depreciación mensual es $800. Se reconoce el mes completo como simplificación didáctica, no como regla general aplicable a cualquier activo. La depreciación contable se distingue de la deducción fiscal.',
    ],
    ejercicios: [
      { id: 'M1-L04-E1', tipo: 'poliza', caso: 'C10', poliza: 'P01' },
      { id: 'M1-L04-E2', tipo: 'calculo', caso: 'C10', concepto: 'Depreciación contable mensual', pregunta: 'Equipo de $24,000, vida útil de 30 meses y valor residual cero: ¿depreciación contable mensual?' },
      { id: 'M1-L04-E3', tipo: 'poliza', caso: 'C10', poliza: 'P02' },
      { id: 'M1-L04-E4', tipo: 'calculo', caso: 'C10', concepto: 'Deducción fiscal anual nominal 30%', pregunta: 'Con la tasa fiscal de 30 % para equipo de cómputo, ¿deducción fiscal anual nominal?' },
    ],
  },
  {
    id: 'M1-L05', modulo: M1, estado: P, titulo: 'Inventarios con PEPS',
    teoria: [
      'PEPS (primeras entradas, primeras salidas): el costo de lo vendido se toma de las capas más antiguas del inventario.',
      'El inventario final queda valuado con las compras más recientes.',
      'La venta tiene dos efectos: el ingreso (con su IVA) y el costo de ventas contra inventario.',
      'En este simulador la venta y su costo se trabajan en pólizas separadas para distinguir ambos efectos. Esta separación es una convención del ejercicio.',
    ],
    ejercicios: [
      { id: 'M1-L05-E1', tipo: 'calculo', caso: 'C14', concepto: 'Costo 10x100+2x120', pregunta: 'Inventario inicial: 10 unidades a $100; compras: 10 a $120. Se venden 12. ¿Costo de ventas con PEPS?' },
      { id: 'M1-L05-E2', tipo: 'calculo', caso: 'C14', concepto: 'Inventario final 8x120', pregunta: '¿Valor del inventario final?' },
      { id: 'M1-L05-E3', tipo: 'poliza', caso: 'C14', poliza: 'P03' },
    ],
  },
  {
    id: 'M1-L06', modulo: M1, estado: P, titulo: 'Conciliación bancaria',
    teoria: [
      'Conciliar es explicar la diferencia entre el saldo del libro y el del estado de cuenta.',
      'Partidas del banco no registradas en libros (comisiones, cobros) se registran con póliza. Partidas en tránsito (cheques no cobrados, depósitos no acreditados) solo se explican en la conciliación.',
      'Si después de todo queda una diferencia, se investiga y se pide soporte. Nunca se "fuerza" el cuadre con una póliza sin documento.',
    ],
    ejercicios: [
      { id: 'M1-L06-E1', tipo: 'poliza', caso: 'C08', poliza: 'P01' },
      { id: 'M1-L06-E2', tipo: 'calculo', caso: 'C08', concepto: 'Libro ajustado', pregunta: 'Libro $50,000 − comisión $116 + cobro no registrado $736 = ¿saldo en libros ajustado?' },
      { id: 'M1-L06-E3', tipo: 'calculo', caso: 'C08', concepto: 'Banco conciliado 47620+5000-3000', pregunta: 'Banco $47,620 + depósito en tránsito $5,000 − cheque pendiente $3,000 = ¿saldo bancario conciliado?' },
      {
        id: 'M1-L06-E4', tipo: 'opcion', caso: 'C08',
        pregunta: 'Queda una diferencia de $1,000 sin explicar. ¿Qué haces?',
        opciones: ['Registrar $1,000 en "otros gastos" para cuadrar', 'Dejar la partida pendiente en la conciliación y pedir soporte al banco y a tesorería', 'Ignorarla porque es poco dinero', 'Modificar el saldo del estado de cuenta en el papel de trabajo'],
        correcta: 1,
        explicacion: 'Una póliza sin soporte esconde el error. La partida queda documentada como pendiente hasta tener evidencia.',
      },
    ],
  },
  {
    id: 'M1-L07', modulo: M1, estado: P, titulo: 'Corrección de errores',
    teoria: [
      'Un registro duplicado no se borra: se corrige con una póliza de reversión que deja rastro de qué se corrigió y por qué.',
      'Antes de corregir hay que confirmar el error con evidencia (por ejemplo, el banco muestra un solo cargo).',
      'Si el error ya se declaró, además puede requerir una declaración complementaria (se verá en el módulo 7).',
    ],
    ejercicios: [
      {
        id: 'M1-L07-E1', tipo: 'opcion', caso: 'C13',
        pregunta: 'Encuentras capturado dos veces el mismo gasto de papelería y el banco muestra un solo cargo. ¿Qué haces?',
        opciones: ['Borrar una de las pólizas del sistema', 'Registrar una póliza de reversión y guardar la evidencia del duplicado', 'Dejarlo así: el gasto es deducible', 'Corregirlo el próximo año'],
        correcta: 1,
        explicacion: 'La reversión conserva la trazabilidad; borrar elimina evidencia.',
      },
      { id: 'M1-L07-E2', tipo: 'poliza', caso: 'C13', poliza: 'P01' },
    ],
  },
  {
    id: 'M1-L08', modulo: M1, estado: P, titulo: 'IVA del mes',
    teoria: [
      'El IVA mensual se determina con flujo de efectivo: IVA trasladado efectivamente cobrado menos IVA acreditable efectivamente pagado.',
      'Si el resultado es positivo hay IVA a cargo y se paga a más tardar el día 17 del mes siguiente.',
      'Si es negativo hay saldo a favor: se puede acreditar en meses siguientes o solicitar en devolución, pero nunca ambas cosas con el mismo saldo.',
    ],
    ejercicios: [
      { id: 'M1-L08-E1', tipo: 'calculo', caso: 'C09', concepto: 'IVA a cargo', pregunta: 'IVA cobrado $4,800 e IVA acreditable pagado $3,200: ¿IVA a cargo?' },
      { id: 'M1-L08-E2', tipo: 'poliza', caso: 'C09', poliza: 'P01' },
      {
        id: 'M1-L08-E3', tipo: 'opcion',
        pregunta: 'Si en un mes el IVA acreditable supera al trasladado, ¿qué es correcto?',
        opciones: ['Se pierde la diferencia', 'Hay saldo a favor: acreditarlo después o pedir devolución, sin duplicar', 'Se puede acreditar y además pedir en devolución', 'Se resta del ISR automáticamente'],
        correcta: 1,
        explicacion: 'El saldo a favor se usa una sola vez: acreditamiento posterior o devolución.',
      },
    ],
  },
  {
    id: 'M1-EX', modulo: M1, estado: P, examen: true, titulo: 'Examen: Fundamentos',
    teoria: ['Un intento por pregunta y sin teoría a la vista. Se aprueba con 80 %.'],
    ejercicios: [
      { id: 'M1-EX-1', tipo: 'poliza', caso: 'C05', poliza: 'P02' },
      { id: 'M1-EX-2', tipo: 'poliza', caso: 'C06', poliza: 'P01' },
      { id: 'M1-EX-3', tipo: 'calculo', caso: 'C14', concepto: 'Utilidad bruta', pregunta: 'Del caso PEPS: venta de 12 unidades a $200 con costo de $1,240. ¿Utilidad bruta?' },
      { id: 'M1-EX-4', tipo: 'calculo', caso: 'C07', concepto: 'Anticipo remanente', pregunta: 'Seguro anual pagado de $12,000 (sin IVA); se aplica un mes. ¿Saldo del pago anticipado?' },
      {
        id: 'M1-EX-5', tipo: 'opcion', caso: 'C08',
        pregunta: 'Tu conciliación no cuadra por $1,000 y el cierre es hoy. ¿Qué entregas?',
        opciones: ['Conciliación con la partida pendiente documentada', 'Conciliación cuadrada con un ajuste a gastos', 'Nada hasta que cuadre', 'La conciliación del mes anterior'],
        correcta: 0,
        explicacion: 'Se entrega a tiempo y se revela la partida pendiente.',
      },
    ],
  },
  {
    id: 'M2-L01', modulo: M2, estado: P, titulo: 'Leer un CFDI',
    teoria: [
      'El CFDI es un XML. TipoDeComprobante indica su naturaleza: I ingreso, E egreso, T traslado, P pago, N nómina.',
      'MetodoPago PUE significa pago en una sola exhibición al emitirse; PPD, pago en parcialidades o diferido.',
      'El IVA aparece en el nodo Impuestos, con base, tasa e importe. SubTotal + traslados − retenciones = Total.',
    ],
    ejercicios: [
      {
        id: 'M2-L01-E1', tipo: 'opcion', xml: '01_ingreso_PUE.xml',
        pregunta: '¿Qué tipo de comprobante es y cómo se pagó?',
        opciones: ['Ingreso, pagado en una sola exhibición (PUE)', 'Ingreso en parcialidades (PPD)', 'Egreso (nota de crédito)', 'Comprobante de pago'],
        correcta: 0,
        explicacion: 'TipoDeComprobante="I" y MetodoPago="PUE".',
      },
      {
        id: 'M2-L01-E2', tipo: 'opcion', xml: '01_ingreso_PUE.xml',
        pregunta: '¿Cuánto IVA trasladado ampara?',
        opciones: ['$1,160.00', '$160.00', '$16.00', '$0.00'],
        correcta: 1,
        explicacion: 'Traslado Impuesto="002" (IVA), TasaOCuota 0.16 sobre base 1,000 = 160.',
      },
      {
        id: 'M2-L01-E3', tipo: 'opcion', xml: '03_egreso.xml',
        pregunta: '¿Qué representa este comprobante?',
        opciones: ['Una nueva venta por $232', 'Un egreso (nota de crédito) relacionado con otro CFDI, que disminuye el ingreso y su IVA', 'Un pago recibido', 'Una nómina'],
        correcta: 1,
        explicacion: 'TipoDeComprobante="E" con CfdiRelacionados TipoRelacion="01" (nota de crédito de los documentos relacionados).',
      },
    ],
  },
  {
    id: 'M2-L02', modulo: M2, estado: P, titulo: 'PPD y complemento de pago',
    teoria: [
      'Una factura PPD se emite antes de cobrarse. Cuando se cobra, el emisor expide un CFDI de tipo Pago (P) con el complemento para recepción de pagos.',
      'El complemento indica el documento relacionado, el número de parcialidad, el saldo anterior, el importe pagado y el saldo insoluto.',
      'El IVA se considera cobrado en la proporción pagada: por eso el complemento desglosa la base y el IVA de cada pago.',
    ],
    ejercicios: [
      {
        id: 'M2-L02-E1', tipo: 'opcion', xml: '02_ingreso_PPD.xml',
        pregunta: 'Esta factura es PPD con FormaPago 99. ¿Qué debe emitirse al cobrarla?',
        opciones: ['Otra factura de ingreso por el cobro', 'Un CFDI de tipo Pago con complemento para recepción de pagos', 'Una nota de crédito', 'Nada'],
        correcta: 1,
        explicacion: 'Los cobros de facturas PPD se amparan con CFDI de pago (complemento Pagos 2.0).',
      },
      {
        id: 'M2-L02-E2', tipo: 'opcion', xml: '04_pago_parcial.xml',
        pregunta: '¿Cuál es el saldo insoluto después de este pago?',
        opciones: ['$0.00', '$580.00', '$1,160.00', '$80.00'],
        correcta: 1,
        explicacion: 'ImpSaldoAnt 1,160 − ImpPagado 580 = ImpSaldoInsoluto 580.',
      },
      {
        id: 'M2-L02-E3', tipo: 'opcion', xml: '04_pago_parcial.xml',
        pregunta: '¿Cuánto IVA se considera efectivamente cobrado con este pago?',
        opciones: ['$160.00', '$80.00', '$580.00', '$0.00'],
        correcta: 1,
        explicacion: 'TrasladoDR: base 500 a 16 % = 80. Es la proporción cobrada.',
      },
    ],
  },
  {
    id: 'M2-L03', modulo: M2, estado: P, titulo: 'XML legible no es CFDI válido',
    teoria: [
      'Un CFDI válido lleva el sello del emisor, su certificado (CSD) y el timbre fiscal digital del PAC, y puede verificarse ante el SAT.',
      'Un XML que se puede leer pero sin sello ni timbre no ampara nada fiscalmente.',
      'Un comprobante incompleto (datos genéricos, sin todos los conceptos) debe corregirse antes de usarse como soporte.',
    ],
    ejercicios: [
      {
        id: 'M2-L03-E1', tipo: 'opcion', xml: '01_ingreso_PUE.xml',
        pregunta: 'El atributo Sello está vacío y no hay timbre fiscal digital. ¿Es un CFDI válido?',
        opciones: ['Sí, porque el XML se abre bien', 'No: le faltan el sello, el certificado y el timbre', 'Sí, si el RFC es correcto', 'Solo si el total es menor a $2,000'],
        correcta: 1,
        explicacion: 'Sin sello ni timbre no es CFDI: es solo un XML.',
      },
      {
        id: 'M2-L03-E2', tipo: 'opcion', xml: '06_nomina_parcial.xml',
        pregunta: '¿Por qué este archivo no basta para comprobar una nómina integral?',
        opciones: ['Porque es de febrero', 'Es un XML sintético y parcial: no acredita timbrado ni reúne los datos y cálculos necesarios para comprobar una nómina integral', 'Porque el ISR es muy alto', 'Porque la nómina no lleva XML'],
        correcta: 1,
        explicacion: 'El archivo sirve para practicar la lectura de algunos campos. No permite validar por sí solo trabajador, salario base de cotización, ISR, subsidio, cuotas y demás conceptos aplicables. La procedencia de cada deducción depende de los supuestos del caso.',
      },
    ],
  },
  {
    id: 'M2-EX', modulo: M2, estado: P, examen: true, titulo: 'Examen: Documentación fiscal',
    teoria: ['Un intento por pregunta y sin teoría a la vista. Se aprueba con 80 %.'],
    ejercicios: [
      {
        id: 'M2-EX-1', tipo: 'opcion', xml: '05_traslado.xml',
        pregunta: 'Este CFDI de tipo T tiene total 0. ¿Debe registrarse como ingreso?',
        opciones: ['Sí, por el valor de la mercancía', 'No: ampara el traslado de mercancías, no una venta', 'Sí, como ingreso exento', 'Solo si hay Carta Porte'],
        correcta: 1,
        explicacion: 'El traslado acredita la tenencia y el transporte de la mercancía, no una operación de venta.',
      },
      {
        id: 'M2-EX-2', tipo: 'opcion', xml: '02_ingreso_PPD.xml',
        pregunta: 'Al emitir esta factura PPD, ¿cuánto IVA cobrado registras?',
        opciones: ['$160.00', '$0.00 (queda como trasladado no cobrado hasta el cobro)', '$80.00', '$1,160.00'],
        correcta: 1,
        explicacion: 'Sin cobro no hay IVA cobrado: va a "IVA trasladado no cobrado".',
      },
      {
        id: 'M2-EX-3', tipo: 'opcion', xml: '04_pago_parcial.xml',
        pregunta: '¿Qué número de parcialidad es este pago?',
        opciones: ['1', '2', '580', 'No se indica'],
        correcta: 0,
        explicacion: 'NumParcialidad="1".',
      },
      {
        id: 'M2-EX-4', tipo: 'opcion', xml: '03_egreso.xml',
        pregunta: '¿Cuánto IVA se disminuye con esta nota de crédito?',
        opciones: ['$232.00', '$32.00', '$200.00', '$16.00'],
        correcta: 1,
        explicacion: 'Base 200 a 16 % = 32.',
      },
      {
        id: 'M2-EX-5', tipo: 'opcion',
        pregunta: '¿Qué distingue a un CFDI de un XML cualquiera?',
        opciones: ['La extensión .xml', 'El sello digital, el certificado y el timbre fiscal del PAC', 'El logotipo de la empresa', 'Que se envíe por correo'],
        correcta: 1,
        explicacion: 'Sello, certificado y timbre lo hacen verificable.',
      },
    ],
  },
  {
    id: 'M3-L01', modulo: M3, estado: P, titulo: 'RESICO personas físicas: el pago mensual',
    teoria: [
      'En RESICO la persona física paga ISR mensual sobre los ingresos efectivamente cobrados en el mes, amparados por CFDI, sin IVA y sin restar gastos.',
      'A esos ingresos se les restan los descuentos, devoluciones y bonificaciones del mes cuando son procedentes y están documentados (CFDI de egreso relacionado con el ingreso y soporte del reembolso). En el caso de la factura PPD, no se incluye porque no hubo cobro. Si existió cobro, la falta del complemento debe corregirse y no justifica omitir el ingreso efectivamente recibido.',
      'Se aplica una sola tasa (de 1.00 % a 2.50 %) al total del mes, según el rango en que cae. No es escalonada como la tarifa de sueldos.',
      'Si una persona moral le pagó, le retuvo 1.25 % de ISR (sobre el pago sin IVA): ese importe se resta del impuesto mensual. Si la retención supera al impuesto, el excedente es solo un resultado aritmético: no es una devolución autorizada ni se traslada automáticamente a otro mes.',
      'El pago vence el día 17 del mes siguiente.',
    ],
    ejercicios: [
      { id: 'M3-L01-E1', tipo: 'calculo', caso: 'R01', concepto: 'Impuesto mensual', pregunta: '¿Impuesto mensual?' },
      { id: 'M3-L01-E2', tipo: 'calculo', caso: 'R02', concepto: 'ISR retenido por la persona moral', pregunta: '¿Cuánto le retuvo la persona moral?' },
      { id: 'M3-L01-E3', tipo: 'calculo', caso: 'R02', concepto: 'Excedente de retenciones (aritmético)', pregunta: 'Con una tasa de 1.10 %, ¿en cuánto excede la retención al impuesto?' },
      { id: 'M3-L01-E4', tipo: 'calculo', caso: 'R03', concepto: 'Base gravable', pregunta: '¿Base gravable del mes?' },
      { id: 'M3-L01-E5', tipo: 'calculo', caso: 'R04', concepto: 'Tasa aplicable %', pregunta: '¿Qué tasa aplica (en %)?' },
      { id: 'M3-L01-E6', tipo: 'calculo', caso: 'R04', concepto: 'Impuesto a cargo', pregunta: '¿Impuesto a cargo después de la retención?' },
      {
        id: 'M3-L01-E7', tipo: 'opcion',
        pregunta: 'Un cliente RESICO facturó $15,000 con método PPD y aún no le pagan. ¿Qué pasa con ese ingreso este mes?',
        opciones: ['Se declara porque ya se facturó', 'No se incluye este mes porque aún no se ha cobrado; al cobrar debe atenderse también la documentación del pago', 'Se declara la mitad', 'Se declara y se pide devolución si no se cobra'],
        correcta: 1,
        explicacion: 'El hecho determinante del caso es que no hubo cobro. No debe confundirse esa situación con un cobro recibido cuyo complemento se omitió.',
      },
    ],
  },
];

export const todosEjercicios = lecciones.flatMap((l) => l.ejercicios);
export const leccionDe = (ejId: string) => lecciones.find((l) => l.ejercicios.some((e) => e.id === ejId))!;

import type { Progreso } from './progreso';
export const APROBATORIO = 80;
export const leccionCompleta = (l: Leccion, p: Progreso) =>
  l.examen ? (p.examenes[l.id] ?? 0) >= APROBATORIO : l.ejercicios.every((e) => p.completados[e.id]);
