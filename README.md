# Simulador Contable MX

Simulador web de la carrera contable en México: de recién egresado sin clientes a jefe de contabilidad o contralor de un corporativo.
Combina una **Academia** (lecciones, ejercicios, exámenes, progreso) con una **Carrera** (escritorio virtual con clientes, calendario fiscal y consecuencias).

> Material educativo, ejercicio 2026 v0.1, pendiente de validación profesional. **No usar para declarar ni pagar impuestos.**

- Visión completa, temario, mecánicas y roadmap: [`docs/plan.md`](docs/plan.md)
- Mejoras pedagógicas recibidas: [`datos/Mejoras.md`](datos/Mejoras.md)

## Estado: Fase 0
- Motor contable (`src/engine/contable.ts`): validación de pólizas, balanza y comparación con la solución. Importes en centavos.
- Motor fiscal (`src/engine/fiscal.ts`): ISR con la tarifa del art. 96 y subsidio por vigencia (enero vs febrero–diciembre).
- Primera lección jugable: *Partida doble: tu primera póliza* (casos C01–C03), con progreso guardado en el navegador.

## Datos
`datos/originales/` guarda el paquete entregado sin modificar: es la fuente de verdad.
`scripts/importar.py` lo convierte en `content/*.json` y falla si alguna póliza no cuadra o alguna cuenta no existe.
Las tablas marcadas `habilitado_calculo=NO` o pendientes (ISN, CEAV, cuota fija IMSS) quedan en `solo_referencia` y el motor no las usa.

## Pendientes del usuario
- Tabla de tasas RESICO PF 2026 (art. 113-E) y 3–5 casos RESICO resueltos con el formato de `casos_motor.json`, para activar la ruta despacho.
- Los pendientes de `datos/originales/paquete_contable_2026/09_control/pendientes_validacion.xlsx`, sobre todo P08 (subsidio 535.65 vs 536.22).

## Uso
```bash
npm install
npm run dev        # app en http://localhost:5173
npm test           # 23 pruebas de los motores contra los casos del paquete
npm run importar   # regenerar content/ desde datos/originales (requiere Python con openpyxl)
```
