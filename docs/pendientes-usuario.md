# Lo que necesito de ti para completar cada fase

Lista viva: se actualiza en cada entrega. Última revisión integrada: `datos/revisiones/revision_pendientes_2026-11-11.md` (propuestas aplicadas; **nada pasa a VALIDADO** por esa revisión). Estados: **FALTA** · **RECIBIDO** (aún sin validar) · **VALIDADO**.
Formatos: tablas en Excel/CSV con columna de fuente; casos con el formato de `casos_motor.json` + una hoja de Excel por caso; texto en Word o Markdown. Nunca datos reales de contribuyentes.

## Fase 0 – Base · ✅ terminada
| Qué | Estado |
|---|---|
| Parámetros 2026, catálogo, 14 casos, XML, anécdotas, puestos, plantillas | RECIBIDO (paquete v0.1) |
| Revisar los pendientes de `09_control/pendientes_validacion.xlsx` | FALTA |
| P08 subsidio: 3,439.46 × 15.59 % = 536.21; 3,566.22 × 15.02 % = 535.65; el decreto menciona 536.22. No fijar 536.22 como cuota universal: falta el decreto con sus disposiciones operativas, vigencias, límite de ingresos y condiciones | FALTA |

## Fase 1 – MVP "Tu primer mes"
### Ruta PyME · ✅ construida · NO aprobada globalmente
| Qué necesito | Dónde revisarlo | Estado |
|---|---|---|
| Validar la teoría y las preguntas de las lecciones y exámenes | `docs/lecciones.txt` (copia exacta, verificada por prueba) | **PROPUESTAS APLICADAS** (M1-L01 IVA y cuadre, M1-L02/L05 convención de pólizas, M1-L04 supuestos, M2-L03-E2, M3-L01 cobro y complemento); falta validación |
| Validar la narrativa y el orden del mes PyME (20 tareas) | `content/carrera/pyme-feb-2026.json` | FALTA |
| Saldo de IVA de $5,120: conciliado por componente | `docs/conciliacion-iva-pyme.md` (es prueba automática) | **CONCILIADO ARITMÉTICAMENTE**; falta comprobar los requisitos de acreditamiento de cada componente |
| Seguro (cobertura gravada) y equipo (uso exclusivo en actividades gravadas, disponible desde la compra): supuestos explícitos | `content/carrera/pyme-feb-2026.json` | **APLICADO**; revisar el soporte de los supuestos |
| Nombre ficticio genérico «Comercial X, S.A. de C.V. (ficticia)» | `content/carrera/pyme-feb-2026.json` | **APLICADO**, por tu decisión |
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
| Lección M3-L01 | `docs/lecciones.txt` | **PROPUESTAS APLICADAS** (lo determinante es el cobro, no el complemento); falta validación |
| Tratamiento fiscal de descuentos en R03/R05 y procedimiento para el excedente de retenciones | — | **ABIERTO** |
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
| ISN por entidad (P01): llenar entidad, ejercicio, vigencia, base, tasa o tarifa, adicionales, exclusiones y estímulos, fundamento, URL oficial y estado de cotejo. Sin ceros en datos no verificados; sin cálculo con tasas referenciales | `datos/plantillas/isn_por_entidad_plantilla.csv` (32 entidades, SIN_COTEJO) | **PLANTILLA ENTREGADA**, falta llenarla |
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
| Hosting | **DECIDIDO: GitHub Pages.** Flujo listo en `.github/workflows/pages.yml` (pruebas + compilación + publicación). Falta que actives *Settings → Pages → Source: GitHub Actions* en el repositorio. Dominio propio: opcional, sin decidir |
| Inicio de sesión | **DECIDIDO: Google y GitHub.** GitHub Pages solo sirve archivos estáticos, así que falta elegir el servicio de autenticación y datos que guardará cuentas y progreso |
| Diseño o texto del certificado | FALTA |
| Qué necesita ver un profesor (grupos, calificaciones, exportar a Excel) | FALTA |
