# Revisión de pendientes del simulador contable

**Fecha de emisión:** 11 de noviembre de 2026.  
**Proyecto:** De 0 a CFO.  
**Documento rector:** `docs/pendientes-usuario.md`.  
**Versión de referencia:** `5df1b48a0446a1f85bb8b0f89f66751b404fd248`.  
**Rama de referencia:** `claude/ecstatic-allen-dlkm3k`.  
**Estado de esta entrega:** revisión documental parcial y propuestas de corrección; sin modificaciones al código y sin validación global de la Fase 1.

> Material educativo. Este documento no constituye dictamen profesional ni autorización para presentar declaraciones o pagar impuestos.

## Alcance

Este documento reúne las observaciones de la revisión anterior y las convierte en instrucciones de corrección. La versión fijada del [archivo de pendientes](https://github.com/Mini-Buda-CH/Prueba-inicial-del-simulador-contable/blob/5df1b48a0446a1f85bb8b0f89f66751b404fd248/docs/pendientes-usuario.md) es el alcance de referencia; no se trata de una auditoría general del repositorio.

Decisiones proporcionadas por el responsable del proyecto:

- Usar nombres ficticios genéricos del estilo «Comercial X».
- Preparar el ISN como tabla por entidad federativa, con vigencias, fundamento, fuentes y estado de verificación.
- Excluir hosting y autenticación. No se consideran bloqueos de esta revisión.
- Entregar archivos descargables, sin PR; utilizar ZIP cuando se entreguen varios archivos.

**Este archivo es un informe independiente. No sustituye automáticamente `docs/pendientes-usuario.md`, no aplica cambios a los archivos mencionados y no debe usarse como evidencia de pruebas no ejecutadas.**

## Fuentes del proyecto

Las observaciones siguientes se refieren a archivos de la misma versión de referencia, recuperados para preparar esta entrega:

| Archivo | Uso en la revisión |
|---|---|
| [docs/pendientes-usuario.md](https://github.com/Mini-Buda-CH/Prueba-inicial-del-simulador-contable/blob/5df1b48a0446a1f85bb8b0f89f66751b404fd248/docs/pendientes-usuario.md) | Identificar solicitudes y estados registrados. |
| [src/lecciones.ts](https://github.com/Mini-Buda-CH/Prueba-inicial-del-simulador-contable/blob/5df1b48a0446a1f85bb8b0f89f66751b404fd248/src/lecciones.ts) | Localizar las formulaciones pedagógicas observadas. |
| [content/casos_resico.json](https://github.com/Mini-Buda-CH/Prueba-inicial-del-simulador-contable/blob/5df1b48a0446a1f85bb8b0f89f66751b404fd248/content/casos_resico.json) | Contrastar los datos y resultados de R01–R05. |
| [content/carrera/pyme-feb-2026.json](https://github.com/Mini-Buda-CH/Prueba-inicial-del-simulador-contable/blob/5df1b48a0446a1f85bb8b0f89f66751b404fd248/content/carrera/pyme-feb-2026.json) | Revisar narrativa, nombre de la empresa y supuestos visibles. |

## Correcciones pedagógicas propuestas

**Estado común:** propuestas pendientes de integrar. Aplicarlas a `src/lecciones.ts` y sincronizar la versión de consulta `docs/lecciones.txt`. No se propone cambiar el estado general de las lecciones a `VALIDADO` con esta entrega.

### M1-L01: IVA separado

**Observación:** conviene distinguir operaciones cobradas o pagadas de operaciones pendientes y evitar que la explicación sugiera acreditamiento automático por cualquier compra.

**Redacción propuesta:**

> En las operaciones gravadas de este módulo, registra el IVA por separado. Distingue el trasladado cobrado del pendiente de cobro, y el acreditable pagado del pendiente de pago. El acreditamiento exige además cumplir los requisitos fiscales aplicables; pagar una compra no basta por sí solo.

El criterio de cobro efectivo del IVA debe distinguirse de la simple emisión del comprobante; la LIVA contempla varias formas de satisfacción de la contraprestación, no únicamente el efectivo físico. [cite:403] Fuente primaria: [LIVA, artículo 1o.-B, SAT](https://wwwmatnp.sat.gob.mx/articulo/09020/articulo-1-b).

**Criterio de aceptación:** la lección distingue los cuatro estados del IVA y no presenta el pago como único requisito de acreditamiento.

### M1-L01: cuadre y soporte

**Observación:** la comprobación de cargos y abonos es necesaria, pero la explicación debe dejar claro que no demuestra por sí sola la corrección de cuentas y documentos.

**Redacción propuesta:**

> Una póliza debe cuadrar y cada renglón debe contener cargo o abono, no ambos. Estas comprobaciones son necesarias, pero no sustituyen revisar cuentas, importes, soporte y tratamiento contable.

**Criterio de aceptación:** el estudiante no interpreta «cuadra» como equivalente a «todo está correcto».

### M1-L02 y M1-L05: pólizas separadas

**Observación:** separar cobro y reclasificación de IVA, o venta y costo, es una elección didáctica del simulador. Debe evitarse presentarla como una obligación universal sobre el número de pólizas.

**Añadir en M1-L02:**

> En este simulador el cobro o pago y la reclasificación del IVA se registran en pólizas separadas para facilitar el aprendizaje. Esta separación es una convención del ejercicio.

**Añadir en M1-L05:**

> En este simulador la venta y su costo se trabajan en pólizas separadas para distinguir ambos efectos. Esta separación es una convención del ejercicio.

**Criterio de aceptación:** conservar los ejercicios y sus identificadores; aclarar la convención sin eliminar ninguno de los efectos contables.

### M1-L04: depreciación del caso

**Observación:** los supuestos del caso deben quedar explícitos y distinguirse de una regla fiscal o contable general.

**Redacción propuesta:**

> El caso supone que el equipo está disponible para uso desde su adquisición. Para este ejercicio se utilizan costo de $24,000, valor residual cero y vida útil de 30 meses: la depreciación mensual es $800. Se reconoce el mes completo como simplificación didáctica, no como regla general aplicable a cualquier activo. La depreciación contable se distingue de la deducción fiscal.

**Comprobación aritmética:** $24,000 / 30 meses = $800 mensuales.

**Criterio de aceptación:** no volver a utilizar 36 meses con una depreciación de $800; no confundir este cálculo con la deducción fiscal anual nominal.

### M2-L03: XML de nómina parcial

**Observación:** la justificación debe explicar la insuficiencia del ejemplo completo y no convertir la presencia de una deducción específica en condición universal de validez.

**Pregunta propuesta:**

> ¿Por qué este archivo no basta para comprobar una nómina integral?

**Sustituir la opción correcta, conservando su índice:**

> Es un XML sintético y parcial: no acredita timbrado ni reúne los datos y cálculos necesarios para comprobar una nómina integral.

**Explicación propuesta:**

> El archivo sirve para practicar la lectura de algunos campos. No permite validar por sí solo trabajador, salario base de cotización, ISR, subsidio, cuotas y demás conceptos aplicables. La procedencia de cada deducción depende de los supuestos del caso.

**Criterio de aceptación:** el ejemplo sigue identificado como sintético y no se presenta como recibo fiscal utilizable.

### M3-L01: cobro y complemento

**Observación:** la omisión del complemento no debe sugerirse como una vía para omitir ingresos ya recibidos. La LISR establece el criterio de ingresos efectivamente cobrados para el cálculo mensual RESICO. [cite:416] Fuente primaria: [LISR, artículo 113-E, SAT](https://wwwmat.sat.gob.mx/articulo/58780/articulo-113-e).

**Redacción propuesta para el supuesto de la factura PPD:**

> En este caso la factura PPD no se incluye porque no hubo cobro. Si existió cobro, la falta del complemento debe corregirse y no justifica omitir el ingreso efectivamente recibido.

**Opción correcta propuesta para M3-L01-E7:**

> No se incluye este mes porque aún no se ha cobrado; al cobrar debe atenderse también la documentación del pago.

**Explicación propuesta:**

> El hecho determinante del caso es que no hubo cobro. No debe confundirse esa situación con un cobro recibido cuyo complemento se omitió.

**Criterio de aceptación:** se conserva la respuesta correcta del caso sin condicionar la existencia del ingreso a la emisión del complemento.

## Comprobaciones RESICO

Los siguientes resultados son comprobaciones aritméticas de los datos consignados en [R01–R05](https://github.com/Mini-Buda-CH/Prueba-inicial-del-simulador-contable/blob/5df1b48a0446a1f85bb8b0f89f66751b404fd248/content/casos_resico.json). No constituyen ejecución del motor ni aprobación fiscal de los supuestos.

| Caso | Operación en pesos | Resultado |
|---|---|---|
| R01 | $18,000 × 1 % | ISR mensual de $180. |
| R02 | $40,000 × 1.10 % = $440; retención de $500 | Excedente aritmético de retenciones de $60. |
| R03 | ($30,000 − $5,000) × 1 % | ISR mensual de $250, condicionado a la procedencia del ajuste de ingresos. |
| R04 | $60,000 × 1.50 % − $500 | ISR a cargo de $400. |
| R05 | ($60,000 − $5,000) × 1.50 % − $500 | ISR a cargo de $325, condicionado a la procedencia del ajuste de ingresos. |

**Resultado:** las operaciones coinciden con los resultados numéricos de los casos. Se mantiene abierta la validación fiscal del tratamiento de descuentos y devoluciones en R03 y R05, así como el procedimiento aplicable a excedentes de retención. Un excedente aritmético no equivale por sí mismo a devolución autorizada.

**Pendiente documental:** completar el cotejo de las disposiciones y reglas de 2026 sobre anual RESICO, salida, retorno y devolución. Este documento no concluye ese análisis ni presenta las reglas de años anteriores como evidencia suficiente.

## Historia PyME

La [historia consultada](https://github.com/Mini-Buda-CH/Prueba-inicial-del-simulador-contable/blob/5df1b48a0446a1f85bb8b0f89f66751b404fd248/content/carrera/pyme-feb-2026.json) contiene 20 tareas, desde la apertura del libro hasta la declaración y comunicación del IVA, e incluye supuestos sobre seguro y depreciación. Su presencia no equivale a aprobación integral de la secuencia.

| Elemento | Cambio o condición propuesta | Estado |
|---|---|---|
| Nombre de empresa | Sustituir por «Comercial X, S.A. de C.V. (ficticia)» y mantener consistencia en los materiales relacionados. | Decisión recibida; no aplicada. |
| Seguro | Precisar que se trata de una cobertura gravada de la bodega; conservar vigencia del 1 de febrero de 2026 al 31 de enero de 2027. | Propuesta de aclaración; revisar soporte del supuesto. |
| Equipo de cómputo | Explicitar destino exclusivo a actividades gravadas y disponibilidad para uso; no equiparar acreditamiento de IVA con depreciación. | Propuesta; acreditamiento pendiente de cotejo completo. |
| Depreciación | Mantener la convención del mes completo como simplificación del ejercicio. | Propuesta documental. |
| Saldo de IVA de $5,120 | Reconciliar cada componente del libro y comprobar requisitos aplicables antes de aprobarlo. | No validado en esta entrega. |

**Límite:** escribir supuestos en la narrativa no demuestra que las pólizas o el cálculo del IVA los cumplan. No se aprueba globalmente la PyME con este documento.

## Subsidio: P08

Se conserva abierta la validación documental de P08. La discrepancia debe resolverse distinguiendo operaciones aritméticas, regla operativa, elegibilidad y redondeo; no se recomienda fijar $536.22 como cuota universal.

| Referencia aritmética del pendiente | Resultado redondeado a centavos |
|---|---|
| $3,439.46 × 15.59 % | $536.21 |
| $3,566.22 × 15.02 % | $535.65 |

Estos datos corresponden al problema identificado en la revisión anterior. Se incluyen para documentar la discrepancia, **no como nuevo cotejo del decreto oficial**. El expediente sigue requiriendo el decreto y sus disposiciones operativas, vigencias, límite de ingresos y condiciones de aplicación antes de cerrar P08 o validar nómina integral.

## Estado de los demás pendientes

El siguiente cuadro agrupa solicitudes que permanecen abiertas en el [documento rector](https://github.com/Mini-Buda-CH/Prueba-inicial-del-simulador-contable/blob/5df1b48a0446a1f85bb8b0f89f66751b404fd248/docs/pendientes-usuario.md). No sustituye su lista detallada.

| Área | Alcance que no queda terminado con este archivo |
|---|---|
| Fase 0 | Cierre de todos los controles de validación, incluido P08. |
| Fase 1 | Aprobación integral de lecciones y exámenes, conciliación de PyME, cierre fiscal/pedagógico de RESICO y casos de IVA con retención. |
| Fase 2 | Casos de nómina integral, IMSS/CEAV, tabla ISN, prima de riesgo, prestaciones, cinco dilemas adicionales e igualas. |
| Fase 3 | Pagos provisionales y anual PM, conciliación contable-fiscal, IVA mixto, DIOT, INPC/recargos, Anexo 24, regularización y capturas autorizadas. |
| Fase 4 | Consolidación, presupuesto, impuestos diferidos, auditoría y sueldos faltantes. |
| Fase 5 | Certificado y requisitos de profesores. Hosting y autenticación quedan excluidos por decisión del responsable. |

**Regla para la futura tabla ISN:** registrar entidad, ejercicio, periodo de vigencia, base, tasa o tarifa, adicionales, exclusiones o estímulos relevantes, fundamento, URL oficial y estado de cotejo. No rellenar datos no verificados con ceros ni habilitar cálculos basados únicamente en tasas referenciales.

## Evidencia y límites

| Actividad | Estado real de esta entrega |
|---|---|
| Recuperación del documento rector en el commit indicado | Realizada. |
| Recuperación de lecciones, casos RESICO e historia PyME de esa versión | Realizada. |
| Localización de formulaciones observadas | Realizada. |
| Contraste aritmético de R01–R05 | Documentado; no es una ejecución del motor. |
| Consulta del criterio de cobro efectivo en páginas legales SAT | Realizada para las precisiones indicadas. [cite:403][cite:416] |
| Aplicación de cambios a código o contenido | No realizada. |
| Ejecución de `npm test`, compilación o pruebas de interfaz | No realizada para esta entrega. |
| Cotejo integral de RMF 2026, subsidio, ISN e IMSS/CEAV | No completado. |
| Dictamen fiscal o validación profesional integral | No emitido. |

Los resultados de pruebas mencionados en conversaciones anteriores no se incorporan como evidencia de esta entrega: este Markdown no adjunta ni acredita su ejecución. No hay cambios a hosting, autenticación ni correcciones técnicas ajenas al alcance documental.

## Uso del documento

1. Guardar este informe como documento de revisión, por ejemplo en `datos/revisiones/`, sin sobrescribir la lista original de pendientes.
2. Integrar las propuestas aceptadas en los archivos correspondientes y mantener sincronizada la copia de lectura de lecciones.
3. Volver a comprobar ejercicios, respuestas y referencias después de integrar los cambios.
4. Actualizar cada estado únicamente al contar con su evidencia; no marcar la Fase 1 ni los controles fiscales como validados por la sola existencia de este informe.
