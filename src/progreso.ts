// Progreso local. Estructura versionada para poder sincronizarla con un servidor en la Fase 5.
export type Progreso = { version: 1; completados: Record<string, string>; examenes: Record<string, number> };
const CLAVE = 'simcont.progreso.v1';

export function cargar(): Progreso {
  try {
    const p = JSON.parse(localStorage.getItem(CLAVE) ?? 'null');
    if (p?.version === 1) return { examenes: {}, ...p }; // examenes se agregó en la Fase 1
  } catch { /* almacenamiento no disponible o dañado: empezar de cero */ }
  return { version: 1, completados: {}, examenes: {} };
}

export function guardar(p: Progreso) {
  try { localStorage.setItem(CLAVE, JSON.stringify(p)); } catch { /* modo privado: el progreso vive solo en memoria */ }
}

/** "1,234.5" -> 123450 centavos; null si el texto no es un importe válido. */
export function aCentavos(texto: string): number | null {
  const t = texto.replace(/[,\s$]/g, '');
  if (t === '') return 0;
  const m = /^(\d+)(?:\.(\d{1,2}))?$/.exec(t);
  return m ? Number(m[1]) * 100 + Number((m[2] ?? '').padEnd(2, '0')) : null;
}
