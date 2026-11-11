# Mejoras propuestas para el simulador de contabilidad en México

## Objetivo

Complementar los ocho módulos existentes con ciclos operativos completos, casos fiscales complejos y un sistema de evaluación basado en decisiones y evidencias.

Este documento distingue contenidos normativos de propuestas pedagógicas. No constituye una validación exhaustiva de vigencia para un ejercicio determinado: antes de implementar cada regla, debe verificarse el texto, sus reformas, disposiciones transitorias y fecha de aplicación.

## 1. Ciclos operativos y documentación

**Integración:** módulos 1, 2 y 6.

- Ventas de contado y a crédito; cuentas por cobrar y antigüedad de saldos.
- Compras y cuentas por pagar; relación entre pedido, recepción, factura y pago.
- Caja chica, fondos por comprobar y transferencias entre cuentas propias.
- Comisiones y cargos bancarios; cobros sin identificar.
- Anticipos, parcialidades y depósitos en garantía.
- Devoluciones, bonificaciones y notas de crédito.
- Viáticos y gastos de empleados: registro contable y evaluación de deducibilidad por separado.

### Caso propuesto

Entregar un expediente desordenado con contrato, XML, estado de cuenta, comprobante de entrega y correos. El alumno debe reconstruir la operación y determinar qué documentación falta.

### Fundamento y fuentes

El SAT distingue los anticipos de los pagos parciales cuando el bien o servicio y su precio ya están determinados. Sus materiales también contemplan el tratamiento de depósitos en garantía y CFDI de egreso.

- [SAT: caso de uso de facturación de anticipos](http://omawww.sat.gob.mx/tramitesyservicios/Paginas/documentos/Caso_uso_Anticipo.pdf).
- [SAT: formato de factura electrónica, Anexo 20](https://wwwmat.sat.gob.mx/consultas/35025/formato-de-factura-electronica-(anexo-20)).

Los ejemplos históricos sirven para explicar conceptos; la implementación técnica debe validarse contra las especificaciones aplicables al periodo simulado.

## 2. Conciliación contable-fiscal y cierre de ISR

**Integración:** módulo 5, conectado con el cierre del módulo 6.

- Conciliación entre utilidad contable y resultado fiscal.
- Ingresos contables no fiscales e ingresos fiscales no contables.
- Deducciones contables no fiscales y deducciones fiscales no contables.
- Gastos no deducibles y parcialmente deducibles.
- Ajuste anual por inflación.
- Pérdidas fiscales: generación, actualización, aplicación y saldo pendiente.
- Deducción fiscal de inversiones; bajas y enajenaciones.
- Diferencia entre depreciación contable y deducción fiscal.

### Caso propuesto

Una empresa presenta utilidad contable, gastos no deducibles, depreciación distinta de la fiscal y pérdidas anteriores. El alumno debe preparar la conciliación y explicar el ISR determinado.

### Fundamento y fuente

LISR: artículos 27–28, 31–38, 44–46 y 57, según el tema y el supuesto aplicable.

- [Cámara de Diputados: Ley del Impuesto sobre la Renta](https://www.diputados.gob.mx/LeyesBiblio/pdf/LISR.pdf).

## 3. IVA con casos complejos

**Integración:** submódulo compartido entre personas físicas y morales.

- Actividades gravadas, a tasa cero, exentas y no objeto.
- Facturación frente a cobro o pago efectivo.
- Requisitos del acreditamiento.
- Identificación directa y acreditamiento proporcional en actividades mixtas.
- Retención, entero y acreditamiento como eventos distintos.
- Saldos a favor: acreditamiento posterior o devolución, evitando duplicidades.
- Importaciones de bienes y servicios.
- Devoluciones, descuentos y bonificaciones.

### Caso propuesto

Una empresa realiza actividades gravadas y exentas, paga gastos comunes y adquiere un activo. El alumno determina el IVA acreditable y documenta el criterio aplicado.

### Fundamento y fuente

LIVA: artículos 1-B, 2-A, 4-A, 5 y 6, entre otros aplicables.

- [Cámara de Diputados: Ley del Impuesto al Valor Agregado](https://www.diputados.gob.mx/LeyesBiblio/pdf/LIVA.pdf).

## 4. CFDI y resolución de inconsistencias

**Integración:** módulo 2.

- Factura global y relación con tickets.
- Anticipos y su aplicación.
- Notas de crédito y relación con la operación original.
- Validación del XML frente a la representación impresa.
- Cruce CFDI–póliza–banco–declaración.
- Documentos duplicados, sustituidos o cancelados.
- Diferencia entre método y forma de pago.
- Distinción entre CFDI de tipo pago y complemento para recepción de pagos.

### Caso propuesto

Resolver una venta con anticipo, devolución parcial y cobro posterior; identificar documentos relacionados y evitar duplicar ingresos o saldos.

### Fuentes

- [SAT: servicio de facturación CFDI 4.0](https://wwwmat.sat.gob.mx/aplicacion/75169/servicio-de-facturacion-cfdi-version-4.0-(vigente-a-partir-del-1-de-enero-de-2022)).
- [SAT: formato de factura electrónica, Anexo 20](https://wwwmat.sat.gob.mx/consultas/35025/formato-de-factura-electronica-(anexo-20)).

## 5. Regímenes y perfiles adicionales

### 5.1 RESICO de personas morales

**Integración:** módulo 5.

- Evaluar requisitos de entrada y permanencia.
- Comparar reglas con el régimen general, sin asumir libre elección en todos los casos.
- Preparar pagos y declaración conforme al régimen aplicable.

**Fuentes:** LISR, título VII, capítulo XII; materiales del SAT para declaración anual de empresas.

- [LISR](https://www.diputados.gob.mx/LeyesBiblio/pdf/LISR.pdf).
- [SAT: declaración anual de empresas](https://www.sat.gob.mx/minisitio/DeclaracionAnual/Empresas/index.html).

### 5.2 Personas físicas con ingresos de distintas fuentes

**Integración:** módulo 3.

- Sueldos más actividad profesional.
- Arrendamiento más intereses.
- Enajenación y adquisición de bienes.
- Dividendos.
- Préstamos, donativos y premios: tratamiento y obligaciones informativas cuando correspondan.

**Caso propuesto:** clasificar depósitos bancarios de distinta naturaleza sin tratarlos automáticamente como ingresos empresariales equivalentes.

**Fuente:** [LISR, título IV](https://www.diputados.gob.mx/LeyesBiblio/pdf/LISR.pdf).

### 5.3 Personas morales con fines no lucrativos

**Integración:** especialidad opcional.

- Distinguir asociaciones civiles, supuestos del título III y donatarias autorizadas.
- Evitar trasladar automáticamente reglas de sociedades mercantiles.

**Fuente:** [LISR, título III](https://www.diputados.gob.mx/LeyesBiblio/pdf/LISR.pdf).

## 6. Competencias financieras explícitas

**Integración:** módulo 6. No sustituye consultar las NIF oficiales aplicables.

| Competencia | Referencia para desarrollar el contenido |
|---|---|
| Ingresos por contratos y costos relacionados | NIF D-1 y D-2 |
| Pagos anticipados y aplicación | NIF C-5 |
| Activos: adquisición, depreciación y baja | NIF C-6 |
| Cuentas por cobrar y deterioro | NIF C-3 y C-16 |
| Provisiones y contingencias | NIF C-9 |
| Arrendamientos | NIF D-5 |
| Impuestos a la utilidad e impuestos diferidos | NIF D-4 |
| Cambios contables y corrección de errores | NIF B-1 |
| Flujo de efectivo y cambios en el capital | NIF B-2 y B-4 |

Hacer explícito el estudio de la NIF A-1, Marco Conceptual, y verificar la estructura normativa correspondiente al ejercicio.

### Fuentes

- [CINIF: listado de normas promulgadas a 2023](https://cinif.org.mx/files/NORMAS_2023.pdf).
- [CINIF: mejoras a las NIF 2024](https://www.cinif.org.mx/assets/mejoras_nif/MejorasNIF2024%20protegido.pdf).
- [CINIF: sitio oficial y edición oficial de las NIF](https://www.cinif.org.mx/).

Los listados históricos identifican normas; no sustituyen el texto vigente ni sus mejoras posteriores. Los proyectos de auscultación no deben programarse como normas ya vigentes.

## 7. Administración del contribuyente y regularización

**Integración:** módulo 7.

- Avisos y actualización de información.
- Declaraciones complementarias.
- Pagos indebidos y solicitudes de devolución.
- Compensación, únicamente cuando proceda.
- Cómputo de plazos y notificaciones.
- Restricción temporal de certificados y aclaración.
- Conservación del expediente contable y fiscal.
- Identificación y actualización del beneficiario controlador.

### Caso propuesto

Detectar una compra duplicada después de declarar; corregir el registro, evaluar efectos fiscales y preparar la regularización y su expediente.

### Fundamento y fuente

CFF: artículos 17-H Bis, 22–23, 28–30 y 32-B Ter y siguientes, según el supuesto. La obligación sobre beneficiario controlador del CFF debe distinguirse del estudio general de la legislación antilavado.

- [Cámara de Diputados: Código Fiscal de la Federación](https://www.diputados.gob.mx/LeyesBiblio/pdf/CFF.pdf).

## 8. Materialidad, razón de negocios y evidencia

**Integración:** eje transversal de ética, documentación y cumplimiento.

- CFDI sin evidencia suficiente de prestación.
- Contrato y factura con entregables incongruentes.
- Operación real con expediente incompleto.
- Operación con beneficio fiscal cuyo propósito económico debe explicarse.

No usar materialidad, requisitos de deducción y razón de negocios como sinónimos.

### Propuesta pedagógica

Solicitar soporte proporcional al caso: contrato, pedido, entregables, recepción, correspondencia y pago. Distinguir una operación inexistente de una operación real mal documentada.

### Fundamento y fuentes

- [CFF, artículo 5-A](https://www.diputados.gob.mx/LeyesBiblio/pdf/CFF.pdf).
- [LISR, requisitos de deducción](https://www.diputados.gob.mx/LeyesBiblio/pdf/LISR.pdf).

## 9. Especialidades opcionales

| Ruta | Contenido sugerido | Fuente principal |
|---|---|---|
| IEPS | Identificar productos o actividades sujetos y tasas o cuotas aplicables | LIEPS y actualizaciones |
| Operaciones internacionales | Retenciones, residencia fiscal, tratados y acreditamiento de ISR extranjero | LISR, artículos 4–5 y título V |
| Reestructuras y terminación | Fusión, escisión y liquidación; requisitos y efectos propios | CFF y disposiciones aplicables |
| Servicios especializados | Expediente del contratante y documentación para efectos fiscales, no solo REPSE | LIVA y disposiciones aplicables |

### Fuentes

- [SAT: leyes fiscales, incluida LIEPS](https://wwwmatnp.sat.gob.mx/normatividad/50768/leyes).
- [LISR](https://www.diputados.gob.mx/LeyesBiblio/pdf/LISR.pdf).
- [CFF](https://www.diputados.gob.mx/LeyesBiblio/pdf/CFF.pdf).
- [LIVA](https://www.diputados.gob.mx/LeyesBiblio/pdf/LIVA.pdf).

## 10. Diseño del simulador

Las siguientes son propuestas de producto y evaluación, no obligaciones legales.

### 10.1 Empresa persistente

Simular varios meses y al menos un cierre anual, arrastrando:

- Clientes y proveedores.
- Inventarios y activos.
- Depreciaciones y controles fiscales.
- Impuestos pendientes.
- Pérdidas fiscales y saldos controlados.
- Errores sin corregir y expedientes incompletos.

### 10.2 Documentación imperfecta

Introducir facturas tardías, cobros sin referencia, diferencias de inventario, gastos personales y documentos faltantes. Permitir solicitar información y dejar asuntos pendientes sin inventar datos.

### 10.3 Evaluación multidimensional

| Dimensión | Elementos de evaluación |
|---|---|
| Registro | Cuenta, importe, fecha y contrapartida |
| Tratamiento fiscal | Procedencia, momento y cálculo |
| Evidencia | Soporte y trazabilidad |
| Cumplimiento | Obligaciones y plazos aplicables |
| Control | Duplicidades y diferencias detectadas |
| Comunicación | Explicación al cliente o supervisor |

### 10.4 Motor normativo versionado

Guardar por caso:

- Ejercicio y periodo.
- Régimen y entidad federativa.
- Versión de reglas utilizada.
- Fuente y disposición exacta.
- Fecha de publicación y entrada en vigor.
- Periodos de aplicación.
- Estado: vigente, derogada, transitoria o propuesta.

Separar reglas de cálculo y datos actualizables de la lógica del juego. No activar iniciativas o proyectos como disposiciones vigentes.

Como base jurídica para la dimensión temporal, revisar el artículo 6 del CFF, que distingue la causación conforme a las disposiciones vigentes al ocurrir los hechos y las reglas de procedimiento posteriores.

**Fuente:** [CFF](https://www.diputados.gob.mx/LeyesBiblio/pdf/CFF.pdf).

## 11. Orden recomendado de implementación

1. Ciclos operativos: ventas, compras, bancos, anticipos y devoluciones.
2. Conciliación contable-fiscal y papeles de trabajo de ISR.
3. IVA: actividades mixtas, retenciones y saldos a favor.
4. Cruces XML–contabilidad–bancos–declaraciones.
5. Corrección de errores y expediente de cumplimiento.
6. Competencias financieras específicas.
7. Especialidades por régimen, sector y complejidad.

## Criterio de aceptación para cada tema

Cada tema debe producir una decisión, un documento, un registro, un cálculo cuando corresponda y una consecuencia posterior. El simulador debe evaluar la coherencia del proceso completo, no únicamente la respuesta numérica final.
