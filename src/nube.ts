// Cuentas y progreso en la nube con Supabase (Google y GitHub). Inactivo si faltan las variables VITE_SUPABASE_*.
import { createClient, type Session } from '@supabase/supabase-js';
import { CLAVE_CARRERA, esEstadoValido, MESES } from './carrera/estado';
import { CLAVE as CLAVE_PROGRESO, esProgreso } from './progreso';
import { alGuardar } from './sync';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const llave = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined; // llave pública: la seguridad la da RLS (supabase/esquema.sql)
export const supabase = url && llave ? createClient(url, llave) : null;

type Fila = { clave: string; datos: unknown };

/** Los datos que llegan de la nube se validan igual que los locales antes de usarse. */
export function esValido(clave: string, datos: unknown): boolean {
  if (clave === CLAVE_PROGRESO) return esProgreso(datos);
  const mes = MESES.find((m) => clave === `${CLAVE_CARRERA}:${m.id}`);
  return !!mes && esEstadoValido(datos, mes);
}

/** Al iniciar sesión: lo que solo está en la nube se baja; lo local se sube. Nunca se pisa lo local.
 * shortcut: si ambos lados tienen la misma clave gana lo local (último en guardar); fusionar por avance cuando haya varios dispositivos por alumno. */
export function fusionar(local: Record<string, unknown>, nube: Fila[]) {
  const bajar = nube.filter((f) => !(f.clave in local) && esValido(f.clave, f.datos));
  const subir = Object.entries(local).filter(([k, v]) => esValido(k, v)).map(([clave, datos]) => ({ clave, datos }));
  return { bajar, subir };
}

function leerLocal(): Record<string, unknown> {
  const r: Record<string, unknown> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)!;
      if (k.startsWith('simcont.') && !k.endsWith(':corrupto')) r[k] = JSON.parse(localStorage.getItem(k)!);
    }
  } catch { /* lo ilegible se ignora: ya tiene respaldo en :corrupto */ }
  return r;
}

/** Sincroniza tras iniciar sesión. Devuelve cuántas claves bajó (si > 0 conviene recargar la vista). */
export async function sincronizar(sesion: Session): Promise<number> {
  if (!supabase) return 0;
  const { data, error } = await supabase.from('progreso').select('clave, datos');
  if (error) throw error;
  const { bajar, subir } = fusionar(leerLocal(), data ?? []);
  for (const f of bajar) localStorage.setItem(f.clave, JSON.stringify(f.datos));
  if (subir.length) {
    const { error: e } = await supabase.from('progreso').upsert(subir.map((f) => ({ ...f, user_id: sesion.user.id, actualizado: new Date().toISOString() })));
    if (e) throw e;
  }
  return bajar.length;
}

/** Cada guardado local se replica en la nube mientras haya sesión. Los errores se reportan, no se silencian. */
export function escucharGuardados(sesion: Session | null, alFallar: (msg: string) => void) {
  alGuardar(sesion && supabase ? (clave, datos) => {
    supabase!.from('progreso').upsert({ user_id: sesion.user.id, clave, datos, actualizado: new Date().toISOString() })
      .then(({ error }) => error && alFallar(`No se pudo guardar en la nube: ${error.message}`));
  } : null);
}

export const iniciarSesion = (proveedor: 'google' | 'github') =>
  supabase?.auth.signInWithOAuth({ provider: proveedor, options: { redirectTo: location.href.split('#')[0] } });
export const cerrarSesion = () => supabase?.auth.signOut();
