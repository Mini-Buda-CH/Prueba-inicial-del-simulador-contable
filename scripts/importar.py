"""Convierte el paquete original (datos/originales) a JSON para la app (content/).
Uso: python3 -I scripts/importar.py   (desde la raíz del repo)
Falla si una póliza no cuadra, si una cuenta no existe o si un agrupador es ambiguo."""
import json, sys, collections
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path
import openpyxl

RAIZ = Path(__file__).resolve().parent.parent
SRC = RAIZ / "datos/originales/paquete_contable_2026"
OUT = RAIZ / "content"

def cent(x):
    """Monto MXN -> centavos enteros (None se conserva)."""
    if x is None or x == "":
        return None
    return int((Decimal(str(x)) * 100).quantize(Decimal(1), ROUND_HALF_UP))

def filas(ws):
    it = ws.iter_rows(values_only=True)
    enc = next(it)
    return [dict(zip(enc, r)) for r in it if any(v is not None for v in r)]

def hoja(libro, nombre):
    return filas(openpyxl.load_workbook(SRC / libro, data_only=True)[nombre])

# --- Catálogo ---
catalogo = [
    {"cuenta": r["cuenta_interna"], "nombre": r["nombre_interno"], "agrupador": str(r["codigo_agrupador_SAT"]),
     "naturaleza": r["naturaleza"], "estado": r["estado"]}
    for r in hoja("02_catalogo/catalogo_inicial.xlsx", "Catalogo")
]
por_agrupador = collections.defaultdict(list)
for c in catalogo:
    por_agrupador[c["agrupador"]].append(c["cuenta"])

# --- Casos ---
casos = []
for c in json.loads((SRC / "03_casos/casos_motor.json").read_text(encoding="utf-8")):
    movs, sumas = [], collections.defaultdict(lambda: [0, 0])
    for poliza, agr, cargo, abono in c["entries"]:
        cuentas = por_agrupador.get(agr, [])
        if len(cuentas) != 1:
            sys.exit(f"{c['id']}: agrupador {agr} -> {cuentas or 'sin cuenta'}; se necesita exactamente una")
        m = {"poliza": poliza, "cuenta": cuentas[0], "cargo": cent(cargo), "abono": cent(abono)}
        sumas[poliza][0] += m["cargo"]; sumas[poliza][1] += m["abono"]
        movs.append(m)
    for p, (d, h) in sumas.items():
        if d != h:
            sys.exit(f"{c['id']} {p}: cargos {d} != abonos {h}")
    casos.append({"id": c["id"], "titulo": c["title"], "enunciado": c["prompt"], "movimientos": movs,
                  "resultados": [{"concepto": k, "valor": cent(v)} for k, v in c["results"]],
                  "supuestos": c["assumptions"], "fuente_id": c["source"], "estado": "PENDIENTE_VALIDACION"})

# --- Parámetros 2026 ---
P = "01_parametros/parametros_2026.xlsx"
def tarifa(nombre):
    return [{"limite_inferior": cent(r["limite_inferior_MXN"]), "limite_superior": cent(r["limite_superior_MXN"]),
             "cuota_fija": cent(r["cuota_fija_MXN"]), "tasa_pct": r["tasa_pct"], "articulo": r["articulo"],
             "fuente_id": r["fuente_id"], "estado": r["estado"]} for r in hoja(P, nombre)]

def referencia(nombre):
    # Tablas no habilitadas para cálculo: se conservan tal cual, solo para consulta.
    return [{k: v for k, v in r.items() if k != "fuente_url"} for r in hoja(P, nombre)]

parametros = {
    "ejercicio": 2026,
    "advertencia": "Material educativo v0.1. No usar para declarar ni pagar.",
    "isr_mensual_art96": tarifa("ISR_mensual"),
    "isr_anual": tarifa("ISR_anual"),
    "uma": [{"desde": r["desde"], "hasta": r["hasta"], "diaria": cent(r["diaria_MXN"]),
             "mensual": cent(r["mensual_MXN"]), "anual": cent(r["anual_MXN"]), "fuente_id": r["fuente_id"]}
            for r in hoja(P, "UMA")],
    "salario_minimo": [{"zona": r["zona"], "desde": r["desde"], "hasta": r["hasta"],
                        "diario": cent(r["diario_MXN"]), "fuente_id": r["fuente_id"]} for r in hoja(P, "Salario_minimo")],
    "subsidio": [{"desde": r["desde"], "hasta": r["hasta"], "limite_ingreso_mensual": cent(r["limite_ingreso_mensual"]),
                  "uma_mensual": cent(r["UMA_mensual"]), "porcentaje_uma": r["porcentaje_UMA"],
                  "cuota_publicada": cent(r["cuota_potencial_redondeada"]), "fuente_id": r["fuente_id"],
                  "pendiente": "P08: considerando del decreto menciona 536.22"} for r in hoja(P, "Subsidio")],
    "solo_referencia": {
        "nota": "habilitado_calculo=NO o estado pendiente: el motor no usa estas tablas.",
        "cuotas_imss": referencia("Cuotas_IMSS"),
        "ceav_2026": referencia("CEAV_2026"),
        "isn": referencia("ISN_32_entidades"),
        "inversiones_lisr": referencia("Inversiones_LISR"),
    },
}

(OUT / "parametros").mkdir(parents=True, exist_ok=True)
for nombre, datos in [("catalogo.json", catalogo), ("casos.json", casos), ("parametros/2026.json", parametros)]:
    (OUT / nombre).write_text(json.dumps(datos, ensure_ascii=False, indent=1, default=str) + "\n", encoding="utf-8")
print(f"OK: {len(catalogo)} cuentas, {len(casos)} casos, {len(parametros['isr_mensual_art96'])} rangos ISR mensual")
