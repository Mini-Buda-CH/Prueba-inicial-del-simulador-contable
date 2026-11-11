# XML sintéticos para el simulador

No son CFDI reales anonimizados: fueron generados desde cero para no exponer datos personales. No están timbrados, no tienen sellos ni certificados válidos, no pasaron validación XSD y no sirven para SAT/PAC ni como prueba de conformidad fiscal. Los UUID solo representan relaciones didácticas; no identifican comprobantes existentes. Los RFC y datos de identificación son genéricos o placeholders.

Los seis XML permiten explorar ingreso PUE, ingreso PPD, egreso, pago parcial con estructura Pagos 2.0, traslado sin Carta Porte y nómina parcial. Revisar cada nota en manifiesto.json. El parser del simulador debe distinguir XML legible de CFDI fiscalmente válido.

Referencia SAT: https://wwwmat.sat.gob.mx/consultas/35025/formato-de-factura-electronica-(anexo-20)
