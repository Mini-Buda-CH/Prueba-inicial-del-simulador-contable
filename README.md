# De 0 a CFO

Simulador web de la carrera contable en México: de recién egresado sin clientes a jefe de contabilidad o contralor de un corporativo.
Combina una **Academia** (lecciones, ejercicios, exámenes, progreso) con una **Carrera** (escritorio virtual con clientes, calendario fiscal y consecuencias).

> Material educativo, ejercicio 2026 v0.1, pendiente de validación profesional. **No usar para declarar ni pagar impuestos.**

- Visión completa, temario, mecánicas y roadmap: [`docs/plan.md`](docs/plan.md)
- Mejoras pedagógicas recibidas: [`datos/Mejoras.md`](datos/Mejoras.md)

## Estado
**Fase 0 (terminada):** motor contable (pólizas, balanza) y fiscal (ISR art. 96, subsidio por vigencia, IVA del mes) en centavos.

**Fase 1, ruta PyME (construida, pendiente de validación):**
- Academia: módulo 1 (8 lecciones + examen) y módulo 2 de CFDI (3 lecciones + examen) con ejercicios de póliza, cálculo y opción múltiple; exámenes de un intento con 80 % para aprobar.
- Carrera: un mes como auxiliar en una PyME ficticia (20 tareas). Las pólizas con errores se arrastran al libro y a la declaración de IVA; los descuadres cuestan días; el cierre se evalúa en registro, control, fiscal, cumplimiento y comunicación.
- Cada tarea de la Carrera exige haber completado su lección.

**Fase 1, ruta RESICO (revisión v0.2 atendida):** tabla legal de 5 tramos del art. 113-E y retención de 1.25 % (cotejadas con fuentes SAT por el revisor), motor `isrResicoMensual`, 5 casos (`content/casos_resico.json`), lección M3-L01 y un mes de despacho con portal RESICO simulado (Ingresos → Determinación → Pago → Envío).

**Marca y diseño:** logos en `public/`; sistema visual (pizarra/marino, verde para positivos, Fira Sans + Fira Code) recomendado por la skill `ui-ux-pro-max`, instalada en `.claude/skills/` para futuras sesiones.

**Correcciones al paquete original:** `datos/correcciones.json` (las aplica `scripts/importar.py`; `datos/originales/` no se modifica).

**Lo que necesito de ti para cada fase:** [`docs/pendientes-usuario.md`](docs/pendientes-usuario.md).

## Datos
`datos/originales/` guarda el paquete entregado sin modificar: es la fuente de verdad.
`scripts/importar.py` lo convierte en `content/*.json` y falla si alguna póliza no cuadra o alguna cuenta no existe.
Las tablas marcadas `habilitado_calculo=NO` o pendientes (ISN, CEAV, cuota fija IMSS) quedan en `solo_referencia` y el motor no las usa.

## Publicación
GitHub Pages, con el flujo `.github/workflows/pages.yml`: cada push a `main` o a la rama de trabajo corre las pruebas, compila y publica. Activar una vez en *Settings → Pages → Source: GitHub Actions*.

Cuentas con Google y GitHub mediante Supabase (opcional; sin configurar, el progreso queda en el navegador): ver [`docs/configurar-supabase.md`](docs/configurar-supabase.md).

## Uso
```bash
npm install
npm run dev        # app en http://localhost:5173
npm test           # 62 pruebas: motores, casos, lecciones, meses PyME y RESICO, revisiones del usuario
npm run importar   # regenerar content/ desde datos/originales (requiere Python con openpyxl)
```
