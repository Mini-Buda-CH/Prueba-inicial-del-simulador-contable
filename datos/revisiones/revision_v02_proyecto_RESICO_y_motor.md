# Revisión v0.2 — archivos actualizados de De 0 a CFO

Fecha de consulta: 10 noviembre 2026. Lectura estática mediante Google Drive; no ejecución de npm test, Vitest ni aplicación. No se modificó Drive. No implica validación integral de vigencia fiscal 2026.

## Alcance

Leídos: content/parametros/2026.json, content/casos_resico.json, content/carrera/resico-mar-2026.json, content/carrera/pyme-feb-2026.json, datos/correcciones.json, README.md, src/engine/fiscal.ts, src/carrera/estado.ts y src/carrera/mes.test.ts.

src/lecciones.ts SÍ se localizó (20098 bytes), pero el conector devolvió contenido vacío al leerlo y al solicitar snippet. No significa que el archivo esté vacío. La teoría, ejercicios y exámenes no están revisados. Se requiere adjuntarlo directamente o aportar una copia .txt sin cambiar el original.

## Hallazgos

### V01 — Tabla RESICO y retención

Los cinco tramos legales mensuales coinciden con el texto de la LISR publicado por el SAT: hasta 25000 1%; hasta 50000 1.1%; hasta 83333.33 1.5%; hasta 208333.33 2%; hasta 3500000 2.5%. Tasa sobre el ingreso total sujeto al cálculo, no marginal por excedente. Art. 113-J: retención PM del 1.25% sobre pagos sin IVA, considerada en el mensual PF.

El sexto tramo abierto a 2.5% aparece en la guía operativa SAT de diciembre 2024, pero NO es un sexto renglón de la tabla legal. Mantenerlo separado o identificado como extensión de interfaz, nunca como permiso de permanecer indefinidamente en el régimen. Registrar ingresos acumulados del ejercicio y alertar por superar 3500000; evaluar el mes siguiente y supuestos legales. Revisar RMF 2026 para reglas complementarias antes de automatizar salida, retorno o anual.

Fuentes:
- https://wwwmat.sat.gob.mx/articulo/58780/articulo-113-e
- https://wwwmatnp.sat.gob.mx/cs/Satellite?blobcol=urldata&blobkey=id&blobtable=MungoBlobs&blobwhere=1705377344031&ssbinary=true
- https://wwwmat.sat.gob.mx/articulo/59511/articulo-113-j
- https://wwwmatnp.sat.gob.mx/cs/Satellite?blobcol=urldata&blobkey=id&blobtable=MungoBlobs&blobwhere=1705377531114&ssbinary=true

### V02 — Casos R01 a R05

La aritmética coincide: R01 180 a cargo; R02 ISR440 menos retención500, excedente60; R03 base25000 e ISR250; R04 ISR900 menos500, cargo400; R05 base55000 e ISR825 menos500, cargo325. CSV adjunto con recálculo independiente en Decimal.

R02: no describir excedente matemático como devolución autorizada ni permitir trasladarlo automáticamente a otro mes sin validar regla aplicable. Revisar denominación fiscal exacta y tratamiento en declaración.

R03/R05: completar evidencia del descuento. Una nota de crédito emitida no debe disminuir cualquier ingreso sin comprobar vinculación y procedencia. Si ya se cobró completo y después se concede descuento, indicar reembolso efectivo en marzo, su soporte, CFDI de egreso relacionado y tratamiento aplicable. Evitar enseñar que todo CFDI E resta automáticamente. La guía SAT documenta el campo de descuentos/devoluciones/bonificaciones, pero no sustituye revisar la realidad de la operación.

Los valores de tasa en resultados usan 100/150 para 1%/1.5%, mientras parámetros usan 1/1.5: documentar que no son importes monetarios y usar un campo tasa_bps o tasa_pct consistente. No formatearlos como dinero.

### V03 — Historia RESICO y mensaje al cliente

R-T01 es correcto para el supuesto expreso de factura no cobrada; no enseñar que la sola clave PPD determina el momento fiscal sin cobros y complementos.

R-T02 contiene una generalización: «Los CFDI de egreso del mes disminuyen los ingresos cobrados». Sustituir por una explicación condicionada a la operación, relación, importe y procedencia documentada.

R-T05 confunde aviso con pago y deja fuera el alcance de IVA. Propuesta:

«Presenté tu declaración de ISR RESICO de marzo: ingresos cobrados $60000 menos el descuento procedente y documentado de $5000, base $55000; ISR $825 menos $500 retenidos, importe a pagar $325. Te envío el acuse y la línea de captura; el vencimiento general del caso es el 17 de abril y falta confirmar el pago. La factura de $15000 se incorporará por la parte que se cobre cuando corresponda. Este ejercicio cubre solo ISR; el IVA se revisa por separado.»

Usar esta redacción solo después de documentar el descuento. Para diseñadora que presta servicios personales independientes a PM, revisar además retención IVA; pertenecer a RESICO no sustituye obligaciones IVA.

Fuentes IVA:
- https://www.diputados.gob.mx/LeyesBiblio/pdf/LIVA.pdf (art.1-A II a)
- https://www.sat.gob.mx/cs/Satellite?blobcol=urldata&blobkey=id&blobtable=MungoBlobs&blobwhere=1461176405075&ssbinary=true (art.3 reglamento)

### V04 — registrarPoliza no es idempotente

estado.ts agrega movimientos siempre con [...e.movimientos,...propios], aunque ya exista e.tareas[t.id]. Si la función se llama dos veces, duplica la póliza y sobrescribe el resultado de la tarea. La UI podría evitar una repetición normal, pero no hay protección en esta función.

Propuesta: rechazar registro duplicado; si se desea rectificar, implementar reversión y nueva póliza con historial. Validar tarea del mes, tipo y requisitos antes de registrar. Agregar prueba de doble envío y recarga.

### V05 — Cambios posteriores a declaración

evaluar usa la bandera ok guardada al presentar. Si después se mutan movimientos, correcta puede conservar true mientras coherente pasa false. Definir bloqueo de periodo tras presentar o declaración versionada con huella del libro y flujo de complementaria. No recalcular silenciosamente el acuse previo.

### V06 — Redondeo

Conservar precisión de cálculo y centavos de la contabilidad. Separar importe determinado de importe a pagar en pesos. Art.20 CFF: para efectuar pago, 1 a 50 centavos hacia abajo, 51 a 99 hacia arriba. No usar Math.round(cantidad_en_pesos): a .50 redondea arriba. En centavos enteros positivos, pago_en_pesos=floor(centavos/100)+(centavos%100>=51?1:0). Esto NO describe cómo redondear cada campo de todos los aplicativos; revisar captura de cada campo por separado.

Fuente: https://wwwmat.sat.gob.mx/articulo/22109/articulo-20

### V07 — Precisión de tasas al extender IMSS

aplicarTasa convierte tasa_pct a centésimas de punto con Math.round(tasaPct*100). Sirve para 1.25 o 1.92, pero pierde tercer decimal: 7.513 se vuelve 7.51 y 0.375 se vuelve 0.38. NO reutilizar esta función sin cambios para CEAV ni todas las cuotas IMSS. Proponer tasas escaladas a una precisión explícita suficiente o decimal exacto; agregar pruebas de 7.513 y 0.375.

### V08 — subsidio no determina elegibilidad completa

subsidioMensual filtra por fecha y tope de ingreso; retencionSueldo limita por ISR. No comprueba por sí sola todos los requisitos del trabajador o tipos de percepción. Marcar función como cálculo bajo elegibilidad previamente validada y no como motor integral de nómina. Subsidio 2026 sigue sujeto al pendiente P08 ya documentado.

### V09 — Validaciones de entradas

Rechazar NaN, infinitos, importes fraccionarios donde se esperan centavos enteros, retenciones negativas y devoluciones incompatibles con el caso. Math.max(base,0) evita impuesto negativo, pero no explica una captura inválida. pagosAnteriores debe especificar si corresponde a pagos de la misma obligación en complementaria; no permitir restar indiscriminadamente ISR de otros meses.

### V10 — Balanza agrupada en prueba

mes.test.ts asigna propia[agr]=saldo. Si dos cuentas internas comparten agrupador, sobrescribe la anterior. Usar propia[agr]=(propia[agr]??0)+saldo y agregar un caso con dos subcuentas del mismo agrupador.

La prueba de saldo no negativo en todas las cuentas solo es válida como expectativa de este escenario; no convertir en regla universal contable.

### V11 — Persistencia

cargarMes solo verifica version y mes; agregar validación de esquema, ids y estructura. Si un guardado está corrupto, intentar el respaldo sin perderlo silenciosamente. guardarMes silencia fallos de almacenamiento: mostrar aviso visible y permitir exportar progreso.

### V12 — PyME conserva observaciones

C10 ya documenta 30 meses para sostener 800. La historia nueva no añade los supuestos fiscales ni la vigencia del seguro que se recomendaron. Mantener IVA5120 condicionado a requisitos; revisar C07 enero frente a compra febrero y convención del primer mes de depreciación. No declarar aprobación global de PyME solo por coincidencia de balanza.

## Estados propuestos, NO aplicados en Drive

- Tabla cinco tramos: COTEJADA con fuentes SAT consultadas; cerrar vigencia normativa anual con texto y reglas 2026.
- Retención 1.25%: COTEJADA art113-J.
- Casos RESICO: ARITMÉTICA COMPROBADA; observaciones fiscales/pedagógicas pendientes.
- Historia RESICO: REVISADA CON CAMBIOS PROPUESTOS.
- C10: corrección de 30 meses DOCUMENTADA; comprobar aplicación al regenerar datos.
- Lecciones y exámenes: archivo localizado, contenido no recuperado; PENDIENTE.
- Motores/tests: LECTURA ESTÁTICA PARCIAL, NO EJECUTADOS.
- Anual, salida, nómina, CEAV e ISN: no validados en esta entrega.

## Próximo archivo necesario

Adjuntar solo src/lecciones.ts directamente al chat o copia lecciones.txt, porque el lector Drive devuelve contenido vacío. No hace falta volver a subir el proyecto entero para revisar esa teoría.
