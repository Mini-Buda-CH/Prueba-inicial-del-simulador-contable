# Simulador de Carrera Contable México — Visión, ideas y plan

## Contexto
El repo `Prueba-inicial-del-simulador-contable` está vacío (rama `claude/ecstatic-allen-dlkm3k`, sin commits).
Referencias que subió el usuario:
- **Ejemplo_sistema.html** = página de Steam de *Network Engineer Simulator*: simulador de oficio donde vas de lugares pequeños a grandes (closets → data centers), con modos "solo práctica" vs "aprende de verdad", diseñado con profesionales reales.
- **Curso.zip** = curso "Aprende SQL" de midudev: temario por módulos (lecciones → examen por bloque), barra de progreso %, contador de ejercicios/exámenes, "continuar lección", playground, glosario, certificado PDF compartible en LinkedIn.

Objetivo: un simulador que lleve al usuario desde recién egresado (0 experiencia, 0 clientes) hasta jefe de contabilidad / contralor de un corporativo, cubriendo la contabilidad y fiscalidad mexicana real, combinando **modo carrera (juego)** + **academia con progreso y certificado (curso)**.

## Decisiones confirmadas
- Formato: **web 2D tipo escritorio virtual** (navegador, PC y celular).
- Público: estudiantes y recién egresados, universidades y profesores, y contadores en activo. El modo profesor queda para la Fase 5, pero desde la Fase 0 el progreso se guarda con una estructura que luego pueda sincronizarse.
- Primera versión: **progreso en el navegador**, sin cuentas.
- Año fiscal: **2026**, y el usuario valida el contenido técnico. Las cifras que yo redacte van marcadas como "por validar" hasta su revisión.
- Niveles de dificultad para los tres públicos: *Guiado* (estudiante), *Normal*, *Experto* (contador en activo: sin ayudas, contra reloj).

## 1. Concepto central: dos capas que se alimentan
1. **Academia** (como el curso): módulos → lecciones con ejercicio interactivo → examen por módulo → certificado. Desbloquea habilidades.
2. **Carrera** (como el simulador): un "escritorio virtual" con calendario, bandeja de correo, clientes/jefe, documentos y portales simulados. Las tareas usan lo aprendido; los errores tienen consecuencias (multas, recargos, perder clientes, despido, reputación).
Regla de oro: *no se puede hacer en la Carrera lo que no se desbloqueó en la Academia*, y cada lección cierra con "ahora hazlo en tu trabajo".

## 2. Rutas de carrera
**Inicio común:** Servicio social / prácticas profesionales → elige ruta (se puede cambiar después).

| Ruta A — Despacho propio | Ruta B — Empleado |
|---|---|
| Freelance desde casa, 1–3 clientes PF (RESICO, plataformas digitales, arrendamiento) | Auxiliar contable en PyME |
| Despacho pequeño: igualas, contratos, cobranza, primer empleado | Contador general / encargado de impuestos |
| Despacho mediano: personas morales, nómina, IMSS, equipo de 5–10 | Auditor Jr/Sr en firma (estilo Big Four, nombre ficticio) |
| Firma: dictámenes, precios de transferencia, clientes corporativos | Supervisor → Gerente contable → Contralor → Director de Finanzas |

Rangos/XP: Pasante → Auxiliar → Contador Jr → Contador Sr → Supervisor → Gerente → Contralor → CFO.

## 3. Contenido contable y fiscal (temario propuesto)
**Módulo 1 – Fundamentos:** cuenta, partida doble, catálogo de cuentas, pólizas (ingreso/egreso/diario), mayor, balanza, NIF serie A.
**Módulo 2 – Documentación fiscal:** RFC, CSF, e.firma vs CSD, buzón tributario, CFDI 4.0 (ingreso, egreso, pago/complemento de pagos, traslado, nómina), cancelación, PUE vs PPD, usos de CFDI, 69-B (EFOS/EDOS).
**Módulo 3 – Personas físicas:** regímenes (sueldos, actividad empresarial y profesional, RESICO, arrendamiento, plataformas), deducciones autorizadas y personales, provisionales ISR, IVA, retenciones, declaración anual.
**Módulo 4 – Nómina y seguridad social:** LFT (aguinaldo, vacaciones, prima vacacional, PTU, finiquito/liquidación), ISR sueldos y subsidio al empleo, IMSS (cuotas, prima de riesgo, SUA/IDSE simulados), INFONAVIT, ISN estatal, REPSE.
**Módulo 5 – Personas morales:** coeficiente de utilidad, pagos provisionales, IVA acreditable, DIOT, depreciación (tasas LISR), CUFIN/CUCA, dividendos, declaración anual PM, contabilidad electrónica (código agrupador, balanza XML).
**Módulo 6 – Contabilidad financiera:** cierre mensual y anual, conciliaciones, inventarios (PEPS/promedio, costo de ventas), estados financieros, NIF series B/C/D, análisis financiero (razones).
**Módulo 7 – Cumplimiento y defensa:** opinión de cumplimiento 32-D, requerimientos, cartas invitación, multas y recargos (actualización con INPC), auditorías del SAT, PRODECON, Ley Antilavado.
**Módulo 8 – Corporativo:** auditoría externa, dictamen fiscal/ISSIF, control interno (SOX para subsidiarias), presupuestos y forecast, consolidación, IFRS vs NIF, precios de transferencia, comercio exterior (IMMEX, pedimentos), gestión de equipo y cierre con fechas duras.
**Transversal:** ética profesional (cliente que pide facturas falsas, deducciones simuladas), Excel/hojas de trabajo, comunicación con clientes, cobranza.

## 4. Mecánicas de juego (ideas)
- **Calendario fiscal real:** vencimientos (día 17, anual PM marzo / PF abril, IMSS día 17, aguinaldo 20-dic, PTU mayo). El tiempo avanza por días; las tareas se acumulan.
- **Bandeja de entrada:** clientes mandan fotos de tickets, XML incompletos, estados de cuenta; el jefe pide reportes.
- **Mini-juegos de trabajo real:**
  - Capturar pólizas (validación de cargos = abonos y cuentas correctas).
  - Clasificar CFDI: ¿deducible? ¿requisitos cumplidos? ¿PUE o PPD? ¿falta complemento de pago?
  - Conciliación bancaria tipo "emparejar movimientos".
  - Calcular provisional ISR/IVA paso a paso (hoja de trabajo guiada → luego sin ayuda).
  - Armar nómina quincenal y cuotas IMSS.
  - Llenar declaraciones en un **portal fiscal simulado** (genérico, sin marca ni logos oficiales).
  - Cierre de mes contra reloj con checklist.
- **Eventos aleatorios:** requerimiento del SAT, cliente en lista 69-B, embargo de cuenta, cliente que no paga la iguala, cambio de ley en enero (actualiza tablas), auditoría sorpresa, empleado que renuncia.
- **Dilemas éticos** con consecuencias a largo plazo (reputación, riesgo legal).
- **Economía:** sueldo / igualas, gastos del despacho, reputación, estrés/tiempo, cartera de clientes.
- **Modos:** Historia (carrera guiada), Práctica libre (sandbox con cualquier caso), Examen (sin ayudas), Reto diario.
- **Herramientas del jugador:** calculadora fiscal, glosario, "Ley de bolsillo" (resúmenes de artículos), catálogo de cuentas, playground contable (como el SQL Playground).

## 5. Sistema de progreso (inspirado en el curso)
- Sidebar con temario, % de avance, "N ejercicios · N exámenes", botón "Continuar".
- Examen por módulo → desbloquea siguiente rango en Carrera.
- Insignias (p. ej. "Primer cierre sin errores", "Cero multas en un año").
- Certificado PDF con página pública verificable (fase posterior, requiere cuentas).
- Panel de profesor (fase posterior): grupos, avance de alumnos — posible modelo de negocio con universidades.

## 6. Arquitectura técnica recomendada (mínima)
- **Web app** (navegador, sin instalar): Vite + React + TypeScript. Funciona en PC y móvil.
- **Contenido como datos**, no código: lecciones en Markdown, ejercicios/casos/eventos en JSON, parámetros fiscales por año en JSON (tarifas ISR, UMA, salario mínimo, cuotas IMSS, ISN por estado). Cambio de año = cambiar un archivo.
- **Motores puros con pruebas (Vitest):**
  - Motor contable: pólizas, mayor, balanza, estados financieros. Dinero en centavos (enteros).
  - Motor fiscal: ISR (art. 96/113/152), IVA, RESICO, nómina/IMSS, recargos. Cada cálculo con casos de prueba validados por un contador.
  - Generador de CFDI ficticios (XML de ejemplo) con RFC de prueba.
- **Progreso en localStorage** al inicio; cuentas/servidor/certificados después.
- Todo dato de contribuyente es ficticio.

## 7. Roadmap por fases
- **Fase 0 – Base:** proyecto, motor contable + pruebas, estructura de contenido, 1 lección completa de punta a punta (vertical slice).
- **Fase 1 – MVP "Tu primer mes":** Academia módulos 1–2, Carrera: auxiliar/freelance con 1 cliente RESICO; capturar pólizas, revisar CFDI, presentar mensual en portal simulado. Progreso + examen.
- **Fase 2:** módulos 3–4, despacho con varios clientes, calendario, nómina e IMSS, eventos y dilemas.
- **Fase 3:** módulos 5–7, personas morales, cierre anual, contabilidad electrónica, auditorías del SAT.
- **Fase 4:** módulo 8 y ruta corporativa (gestión de equipo, dictamen, consolidación).
- **Fase 5:** cuentas, certificado, panel de profesor, ranking.

## 8. Información que necesito del usuario (y formato ideal)
| Qué | Formato ideal |
|---|---|
| Temario deseado / ajustes al propuesto, profundidad por nivel | Markdown o Word |
| Parámetros fiscales vigentes del año a simular (tarifas ISR mensual/anual, subsidio, UMA, salario mínimo, cuotas IMSS, ISN por estado, tasas de depreciación) con fuente | Excel/CSV (una hoja por tabla) |
| Catálogo de cuentas base (con código agrupador SAT) | Excel/CSV |
| Casos prácticos resueltos (enunciado + pólizas + resultado) — los usaré como ejercicios y como pruebas del motor | Excel (una hoja por caso) o Word |
| CFDI de ejemplo **anonimizados** (RFC/nombres ficticios) | XML |
| Anécdotas reales: requerimientos, clientes difíciles, errores típicos, dilemas éticos | Lista en texto (1 párrafo c/u) |
| Puestos, funciones y sueldos de mercado por nivel | Tabla Excel |
| Plantillas reales: carta de encargo, contrato de iguala, papeles de trabajo, checklist de cierre | Word/Excel (PDF solo como referencia) |
| Capturas de flujos de portales (declaraciones, IDSE, SUA) solo como referencia de pasos; se recrean genéricos | PNG |
| Identidad: nombre del proyecto, colores, logo | PNG/SVG + texto |
| Quién valida el contenido técnico (contador con cédula) | — |
Evitar PDF escaneado para tablas (difícil de extraer). Nunca enviar datos reales de clientes.

## 8b. Revisión del paquete v0.1 y de Mejoras.md (recibidos)
Comprobé lo siguiente por mi cuenta:
- Los 14 casos de `casos_motor.json` cuadran en cada póliza.
- Las cuentas que usan los casos existen en el catálogo.
- El ISR de C11 (15,000 → 1,402.82) y de C12 (10,000 → 729.02), recalculado con la tarifa del art. 96, coincide.
- C08 (diferencia de 1,000) y C14 (PEPS) están bien.

Ajustes técnicos que haré al importar:
1. Los casos usan el código agrupador (`102.01`) y el catálogo usa la clave interna (`SIM-102-01`). El motor usará la clave interna y el agrupador será un atributo de la cuenta.
2. Los importes JSON se convierten a centavos al cargarlos. Los cálculos intermedios (tasas, factores) llevan más precisión y se redondean según la regla de cada tabla.
3. Se respetan `estado` y `habilitado_calculo`: las tablas en NO o PENDIENTE (ISN, CEAV, cuota fija IMSS) se muestran solo como referencia y el motor no las usa (Mejoras §10.4).
4. El subsidio se calcula con la fórmula, por vigencia, y la discrepancia 535.65 vs 536.22 queda visible como pendiente P08.

**Decisión del usuario: el MVP tiene dos clientes.**
- Ruta empleado: PyME persona moral del régimen general, con los casos C01–C14 ya entregados.
- Ruta despacho: cliente RESICO persona física. **Falta del usuario:** la tabla de tasas RESICO 2026 (art. 113-E) y 3–5 casos RESICO resueltos con el mismo formato (`casos_motor.json` + hoja Excel).
- Orden: primero se construye la ruta PyME, que ya tiene datos, y la ruta RESICO se activa cuando lleguen sus datos.

Mejoras.md se integra así:
- Temario: se agregan los submódulos IVA complejo, conciliación contable-fiscal, RESICO PM, PF con varias fuentes, no lucrativas, competencias NIF, regularización, materialidad y especialidades. El orden es el de su §11.
- Diseño:
  - empresa persistente entre meses;
  - documentación imperfecta (se puede pedir información o dejar pendientes);
  - evaluación en 6 dimensiones: registro, fiscal, evidencia, cumplimiento, control y comunicación;
  - criterio de aceptación por tema: decisión + documento + registro + cálculo + consecuencia.

## 9. Archivos a crear (Fase 0)
- `datos/originales/`: el paquete v0.1 tal cual, como fuente de verdad versionada.
- `scripts/importar.py`: convierte Excel/JSON → `content/*.json` (parámetros, catálogo, casos) y revisa que cada póliza cuadre y cada cuenta exista.
- `package.json`, `vite.config.ts`, `src/` (app), `src/engine/contable.ts` (pólizas, mayor, balanza), `src/engine/fiscal.ts` (ISR art. 96 y subsidio por vigencia) + `*.test.ts`.
- `content/lecciones/*.md` y `content/parametros/2026.json` (cada valor con su `fuente_id` y `estado`).
- `README.md` con visión y roadmap.

## Verificación (Fase 0)
- `npm test`: los 14 casos como fixtures (cuadre y resultados esperados), ISR de C11/C12, el subsidio de enero vs febrero, los límites de rango de la tarifa y que C08 deje la diferencia de 1,000 sin forzarla a cero.
- `npm run dev` + Playwright: completar la lección vertical slice, ver el % de progreso subir y que persista al recargar.
