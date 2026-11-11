# Conciliación del IVA de febrero 2026 · Comercial X, S.A. de C.V. (ficticia)

**Estado: evidencia aritmética, NO validación fiscal.** Muestra de qué póliza del libro correcto sale cada peso del saldo a favor de $5,120. Falta comprobar en cada renglón los requisitos de acreditamiento: CFDI, pago efectivo y destino a actividades gravadas. La prueba `src/carrera/mes.test.ts` («conciliación del IVA por componente») falla si el libro deja de coincidir con esta tabla.

## IVA trasladado efectivamente cobrado (SIM-208-01)
| Póliza | Operación | Importe |
|---|---|---:|
| T04 (C03 P01) | Venta de contado $30,000 + IVA | 4,800.00 |
| T11 (C04 P04) | Reclasificación del IVA de la mitad cobrada de la venta a crédito | 800.00 |
| T12 (C06 P01) | Devolución de venta de contado (reembolso) | −800.00 |
| **Total** | | **4,800.00** |

## IVA acreditable efectivamente pagado (SIM-118-01)
| Póliza | Operación | Importe | Requisito por comprobar |
|---|---|---:|---|
| PRE-1 | Papelería (captura del auxiliar anterior) | 160.00 | CFDI y pago |
| PRE-2 | Duplicado de la misma papelería | 160.00 | No procede: es un duplicado |
| T02 (C02 P01) | Compra de mercancía pagada | 3,200.00 | CFDI y pago |
| T09 (C05 P03) | IVA de la mitad pagada de la compra a crédito | 800.00 | CFDI, complemento de pago |
| T14 (C07 P01) | Seguro de la bodega (cobertura gravada) | 1,920.00 | CFDI, destino a actividad gravada |
| T15 (C10 P01) | Equipo de cómputo, uso exclusivo en actividades gravadas | 3,840.00 | CFDI, pago, destino |
| T16 (C13 P01) | Reversión del duplicado | −160.00 | — |
| **Total** | | **9,920.00** | |

## Resultado
4,800.00 − 9,920.00 = **saldo a favor aritmético de 5,120.00**.

Quedan fuera del cálculo, porque no se han cobrado ni pagado:
- IVA trasladado no cobrado (SIM-209-01): 800.00;
- IVA pendiente de pago (SIM-119-01): 800.00.
