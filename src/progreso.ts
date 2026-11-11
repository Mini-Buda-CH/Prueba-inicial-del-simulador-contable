import { avisarGuardado } from './sync';
// Progreso local. Estructura versionada para poder sincronizarla con un servidor en la Fase 5.
export type Progreso = { version: 1; completados: Record<string, string>; examenes: Record<string, number> };
export const CLAVE = 'simcont.progreso.v1';

export const esProgreso = (p: unknown): p is Progreso => {
  const x = p as Progreso;
  const mapa = (o: unknown, ok: (v: unknown) => boolean) => !!o && typeof o === 'object' && Object.values(o).every(ok);
  return x?.version === 1 && mapa(x.completados, (v) => typeof v === 'string') && mapa(x.examenes ?? {}, (v) => typeof v === 'number' && v >= 0 && v <= 100);
};

export function cargar(): Progreso {
  try {
    const crudo = localStorage.getItem(CLAVE);
    if (crudo !== null) {
      const p = JSON.parse(crudo);
      if (esProgreso(p)) return { ...p, examenes: p.examenes ?? {} }; // examenes se agregó en la Fase 1
      localStorage.setItem(`${CLAVE}:corrupto`, crudo); // se respalda, no se pierde
    }
  } catch { /* almacenamiento no disponible o JSON dañado: empezar de cero */ }
  return { version: 1, completados: {}, examenes: {} };
}

/** Devuelve false si no se pudo guardar; la UI debe avisar. */
export function guardar(p: Progreso): boolean {
  avisarGuardado(CLAVE, p);
  try { localStorage.setItem(CLAVE, JSON.stringify(p)); return true; } catch { return false; }
}

/** Descarga en JSON todo lo guardado por la app (claves simcont.*), como respaldo. */
export function exportarProgreso() {
  const datos: Record<string, unknown> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)!;
      if (k.startsWith('simcont.')) datos[k] = JSON.parse(localStorage.getItem(k)!);
    }
  } catch { /* se exporta lo que se haya podido leer */ }
  const url = URL.createObjectURL(new Blob([JSON.stringify({ app: 'De 0 a CFO', exportado: new Date().toISOString(), datos }, null, 1)], { type: 'application/json' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: 'de-0-a-cfo-progreso.json' });
  a.click();
  URL.revokeObjectURL(url);
}

/** "1,234.5" -> 123450 centavos; null si el texto no es un importe válido. */
export function aCentavos(texto: string): number | null {
  const t = texto.replace(/[,\s$]/g, '');
  if (t === '') return 0;
  const m = /^(\d+)(?:\.(\d{1,2}))?$/.exec(t);
  return m ? Number(m[1]) * 100 + Number((m[2] ?? '').padEnd(2, '0')) : null;
}
