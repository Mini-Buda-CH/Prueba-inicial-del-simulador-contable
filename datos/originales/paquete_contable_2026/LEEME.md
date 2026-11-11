# Paquete inicial del simulador contable México 2026 — v0.1

Preparado el 10 de noviembre de 2026. Material de desarrollo educativo, NO motor fiscal certificado ni paquete integral validado para cumplimiento real.

## Inventario

| Entrega | Contenido | Estado |
|---|---|---|
| Parámetros | Excel con ISR mensual y anual, UMA con corte enero/febrero, mínimos generales, subsidio por vigencia, cuotas IMSS, CEAV, 32 ISN y selección inversiones LISR | Mezcla de tablas institucionales, primarias y secundarias; ver estado por fila |
| Catálogo | 73 cuentas internas con agrupador SAT de referencia | Inicial, no catálogo SAT completo; fuente histórica pendiente cotejo 2026 |
| Casos | 14 casos ficticios resueltos, una hoja por caso, más JSON para motor | Aritmética y partida doble comprobadas; criterio profesional pendiente |
| XML | 6 ejemplos sintéticos, manifiesto y advertencias | Sin timbrado ni validez fiscal; no anonimizaciones de CFDI reales |
| Anécdotas | 6 resúmenes históricos documentados por PRODECON, un párrafo por caso | Fuentes enlazadas; sin datos personales añadidos |
| Dilemas | 3 escenarios ficticios en archivo separado | No presentarlos como hechos reales |
| Carrera | 10 niveles, funciones propuestas y salarios observados cuando hubo evidencia | Faltantes vacíos y rangos regionales/indirectos identificados |
| Plantillas | Carta de encargo y contrato de iguala Word; Excel con 8 hojas de papeles/checklist | Modelos originales educativos, requieren revisión legal/profesional |
| PNG | 3 diagramas funcionales propios | NO capturas de portal: capturas reales pendientes |
| Control | Fuentes CSV, pendientes Excel, pruebas JSON y manifiesto de integridad | Para revisión y aceptación |

## Advertencias prioritarias

- No cargar automáticamente tablas marcadas NO o PENDIENTE en un motor que se presente como fiscalmente validado.
- En ISN no se verificaron las 32 legislaciones primarias. Las tasas secundarias son un mapa de investigación, no una tabla definitiva para pagar impuestos.
- UMA cambia el 1 de febrero; enero conserva el valor anterior. Salarios mínimos cambian el 1 de enero.
- ISR anual es para ingresos del ejercicio 2026; no para la anual 2025 presentada en 2026. La tarifa mensual de salarios no sustituye todas las tarifas de pagos provisionales ni RESICO.
- Subsidio: el artículo operativo usa un porcentaje de UMA mensual. Con valores INEGI, febrero–diciembre produce 535.65 al redondear a centavos, aunque el considerando del decreto menciona 536.22. Enero produce 536.21. Se conserva la fórmula y se registra la discrepancia para validación, no se oculta ni se fija una cuota universal.
- CEAV 2026 requiere tabla gradual, no tasas finales del artículo 168 sin transitorios. No interpretar el primer renglón como 1 UMA.
- Dinero: diferenciar representación en centavos de precisión de cálculo. Tasas, factores, cantidades y operaciones fiscales pueden requerir decimales intermedios adicionales y reglas específicas de redondeo.
- XML sintácticamente legible NO equivale a CFDI válido. Los ejemplos no contienen certificados, sellos o timbres auténticos.
- El caso C08 mantiene una diferencia deliberada de 1000: la respuesta correcta es investigar, no crear una póliza sin soporte.
- C11/C12 son ejercicios parciales de sueldo/ISR, no nóminas integrales.
- Las capturas reales solicitadas NO están incluidas. Los PNG son diagramas; consultar guía y pendientes. SUA es una aplicación de escritorio.

## Uso recomendado

1. Revisar primero pendientes_validacion.xlsx.
2. Aprobar fuentes y supuestos por cada tabla/caso.
3. Completar leyes locales y fuentes primarias pendientes.
4. Ejecutar los casos JSON como fixtures y ampliar pruebas de fronteras, redondeo y vigencias.
5. Obtener capturas o imágenes de manuales con origen y versión documentados.
6. Solo después habilitar reglas para alumnos y usuarios expertos.

Los resultados de pruebas registran comprobaciones aritméticas y de lectura de archivos; no certificación fiscal. Las fórmulas Excel deben recalcularse al abrirse en una aplicación de hojas de cálculo.
