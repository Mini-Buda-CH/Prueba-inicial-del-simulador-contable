# Cotejo de parámetros contra el texto de la LISR

Fuente: `datos/referencias/leyes/LISR.md` (Cámara de Diputados, última reforma DOF 01-04-2024). La prueba `src/engine/cotejo-lisr.test.ts` repite este cotejo en cada `npm test` y falla si un parámetro deja de coincidir con el texto.

| Parámetro | Artículo | Resultado |
|---|---|---|
| Tabla mensual RESICO PF (5 tramos: 25,000 / 50,000 / 83,333.33 / 208,333.33 / 3,500,000; 1.00 a 2.50 %) | 113-E | **Coincide** |
| Tabla anual RESICO PF (5 tramos: 300,000 / 600,000 / 1,000,000 / 2,500,000 / 3,500,000; 1.00 a 2.50 %) | 113-F | **Coincide** (nueva en esta entrega) |
| Retención de personas morales a PF en RESICO: 1.25 % sin IVA | 113-J | **Coincide** |
| Porcentajes máximos de depreciación del paquete v0.1 (13 renglones) | 34 | **Coinciden los 13**: I b 5 %, III 10 %, IV 6 %, V a 25 %, V b 10 %, VI 25 %, VII 30 %, VIII 35 %, IX 100 %, XII 100 %, XIII 100 %, XIV 25 %, XV 5 % |

## Lo que este cotejo NO cubre
- Reformas posteriores a DOF 01-04-2024 y reglas de la RMF 2026.
- La tarifa del art. 96 2026: la ley trae la tarifa original y la vigente se publica en el Anexo 8 de la RMF; sigue con la fuente INDETEC y el pendiente P11.
- Condiciones y límites de los arts. 35 y 36 (p. ej., el tope de $175,000 para automóviles).
