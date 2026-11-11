# Lo que necesito de ti para completar cada fase

Lista viva: se actualiza en cada entrega. Estados: **FALTA** · **RECIBIDO** (aún sin validar) · **VALIDADO**.
Formatos: tablas en Excel/CSV con columna de fuente; casos con el formato de `casos_motor.json` + una hoja de Excel por caso; texto en Word o Markdown. Nunca datos reales de contribuyentes.

## Fase 0 – Base · ✅ terminada
| Qué | Estado |
|---|---|
| Parámetros 2026, catálogo, 14 casos, XML, anécdotas, puestos, plantillas | RECIBIDO (paquete v0.1) |
| Revisar los pendientes de `09_control/pendientes_validacion.xlsx` (sobre todo P08: subsidio 535.65 vs 536.22) | FALTA |

## Fase 1 – MVP "Tu primer mes"
### Ruta PyME · ✅ construida, pendiente de tu validación
| Qué necesito | Dónde revisarlo | Estado |
|---|---|---|
| Validar la teoría y las preguntas de las 13 lecciones/exámenes (módulos 1 y 2) | `src/lecciones.ts` o en la app | FALTA |
| Validar la narrativa y el orden del mes PyME (20 tareas) | `content/carrera/pyme-feb-2026.json` | FALTA |
| Confirmar el criterio del mes: IVA acreditable completo del equipo de cómputo y del seguro gravado; saldo a favor resultante de $5,120 | `src/carrera/mes.test.ts` | FALTA |
| Confirmar el nombre de la empresa ficticia (hoy: "Comercializadora Escuela S.A. de C.V.") | — | FALTA |

### Ruta RESICO (despacho) · ⏸ bloqueada hasta recibir:
| Qué | Formato | Estado |
|---|---|---|
| Tabla de tasas RESICO PF 2026 (art. 113-E) con fuente | Excel/CSV | FALTA |
| 3–5 casos RESICO resueltos (ingresos cobrados, retenciones de PM, pago mensual) | `casos_motor.json` + Excel | FALTA |
| Reglas de la anual RESICO y causales de salida del régimen | Word/Markdown | FALTA |
| Perfil del cliente: actividad, ingresos típicos, qué documentos manda y qué errores comete | Texto, 1 párrafo | FALTA |

## Fase 2 – Nómina, IMSS y despacho con varios clientes
| Qué | Formato | Estado |
|---|---|---|
| 3–5 casos de nómina integral: SBC, cuotas obrero-patronales, ISR, subsidio, INFONAVIT (tu P13) | casos JSON + Excel | FALTA |
| Tablas IMSS y CEAV 2026 cotejadas con los transitorios (P02, P03) | Excel | FALTA |
| ISN validado de al menos 1 estado (el que usará el juego) (P01) | Excel | FALTA |
| Prima de riesgo de trabajo de ejemplo y su clase | Excel | FALTA |
| Casos de aguinaldo, vacaciones y prima vacacional, finiquito y PTU | casos JSON + Excel | FALTA |
| 5 eventos o dilemas más para el despacho (clientes que no pagan, que no mandan documentos…) | Texto, 1 párrafo c/u | FALTA |
| Honorarios o igualas típicos por tipo de cliente | Excel | FALTA |

## Fase 3 – Personas morales, cierre anual y cumplimiento
| Qué | Formato | Estado |
|---|---|---|
| Casos de pagos provisionales PM (coeficiente de utilidad) | casos JSON + Excel | FALTA |
| Caso de conciliación contable-fiscal y anual PM (Mejoras §2) | Excel | FALTA |
| Casos de IVA mixto: gravado y exento, proporción (Mejoras §3) | casos JSON + Excel | FALTA |
| Layout/campos de la DIOT 2026 | Excel | FALTA |
| INPC y tasa de recargos 2026 (para multas y actualizaciones) | Excel | FALTA |
| Catálogo cotejado contra el Anexo 24 vigente (P04) | Excel | FALTA |
| Casos de regularización: complementaria, devolución, compensación (Mejoras §7) | casos JSON + Excel | FALTA |
| Capturas reales anonimizadas de los portales (P06), solo como referencia de flujo | PNG | FALTA |

## Fase 4 – Ruta corporativa
| Qué | Formato | Estado |
|---|---|---|
| Casos de consolidación, presupuesto, impuestos diferidos (NIF D-4) y hallazgos de auditoría | Excel | FALTA |
| Sueldos faltantes: pasante, Jr y supervisor (P07) | Excel | FALTA |

## Fase 5 – Cuentas, certificado y profesores
| Qué | Estado |
|---|---|
| Dónde se publicará (hosting) y si se usará un dominio propio | FALTA |
| Forma de iniciar sesión (Google, correo, cuenta institucional) | FALTA |
| Diseño o texto del certificado | FALTA |
| Qué necesita ver un profesor (grupos, calificaciones, exportar a Excel) | FALTA |
