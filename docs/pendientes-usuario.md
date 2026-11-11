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
| Revisión inicial de la PyME (balanza, IVA, depreciación) | `datos/revisiones/` | RECIBIDO · la balanza coincide en las 19 cuentas (es prueba automática) |
| C10: vida útil 36 → 30 meses para que cuadre con $800 | `datos/correcciones.json` | APLICADO, por tu decisión |
| Nombre "De 0 a CFO" y logos | `public/` | RECIBIDO |

### Ruta RESICO (despacho) · ✅ jugable · revisión v0.2 atendida
| Qué | Dónde | Estado |
|---|---|---|
| Tabla legal de 5 tramos (art. 113-E) | `content/parametros/2026.json` → `resico_pf_mensual` | **COTEJADA** con fuentes SAT (revisión v0.2). Falta cerrar vigencia anual con texto y reglas RMF 2026 |
| Retención 1.25 % de PM (art. 113-J) | mismo archivo | **COTEJADA** |
| Casos R01–R05 | `content/casos_resico.json` | **ARITMÉTICA COMPROBADA** (tu CSV es prueba automática); observaciones V02 aplicadas, falta tu visto bueno fiscal y pedagógico |
| Historia del mes de despacho | `content/carrera/resico-mar-2026.json` | **REVISADA, CAMBIOS APLICADOS** (V03: mensaje del revisor, alcance solo ISR) |
| Lección M3-L01 y todas las lecciones y exámenes | `docs/lecciones.txt` | **PENDIENTE**: enviado como texto para tu revisor |
| Redondeo | `aPagarPesos` (art. 20 CFF) | **APLICADO** para el importe a pagar; el redondeo de cada campo de cada aplicativo sigue sin modelarse |
| IVA de la diseñadora: retención de IVA por servicios personales independientes a PM (LIVA art. 1-A II a) | — | **FALTA**: casos o reglas para un mes de IVA |
| Anual RESICO, salida y retorno del régimen (RMF 2026) | Word/Markdown | **FALTA** |
| Guía SAT RESICO PF | `datos/referencias/sat_resico/` | RECIBIDO |

### Estado de los motores (revisión v0.2)
| Hallazgo | Estado |
|---|---|
| V04 doble registro · V05 periodo cerrado tras declarar · V09 validación de entradas · V10 suma por agrupador · V11 esquema, respaldo de datos dañados, aviso y exportación | **CORREGIDOS** con pruebas |
| V07 precisión de tasas (7.513 %, 0.375 %) | **CORREGIDO** con pruebas; listo para CEAV/IMSS cuando lleguen tablas validadas |
| V08 subsidio | **DOCUMENTADO**: supone elegibilidad validada; P08 sigue abierto |
| V12 PyME | **SUPUESTOS VISIBLES** (IVA 5,120 condicionado, vigencia del seguro, convención de depreciación). La PyME **no** está aprobada globalmente: falta tu validación |
| Complementarias (corregir después de declarar) | **FALTA**: llega con el módulo 7 |

## Fase 2 – Nómina, IMSS y despacho con varios clientes
| Qué | Formato | Estado |
|---|---|---|
| 3–5 casos de nómina integral: SBC, cuotas obrero-patronales, ISR, subsidio, INFONAVIT (tu P13) | casos JSON + Excel | FALTA |
| Tablas IMSS y CEAV 2026 cotejadas con los transitorios (P02, P03) | Excel | FALTA |
| ISN validado de al menos 1 estado (el que usará el juego) (P01) | Excel | FALTA |
| Prima de riesgo de trabajo de ejemplo y su clase | Excel | FALTA |
| Guía IMSS 2026 de la prima de RT (SUA → DAP → IDSE) | PNG | RECIBIDO (`datos/referencias/imss_dap/`) |
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
