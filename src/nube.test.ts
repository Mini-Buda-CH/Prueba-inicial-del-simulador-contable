import { describe, expect, it } from 'vitest';
import { MES, nuevoEstado } from './carrera/estado';
import { esValido, fusionar } from './nube';

const progreso = { version: 1, completados: { 'M1-L01-E1': '2026-01-01' }, examenes: {} };
const mes = nuevoEstado(MES);

describe('sincronización con la nube', () => {
  it('sin variables de entorno la nube queda inactiva', async () => {
    expect((await import('./nube')).supabase).toBeNull();
  });
  it('valida lo que llega: claves desconocidas o datos dañados se descartan', () => {
    expect(esValido('simcont.progreso.v1', progreso)).toBe(true);
    expect(esValido('simcont.carrera.v1:pyme-feb-2026', mes)).toBe(true);
    expect(esValido('simcont.progreso.v1', { version: 9 })).toBe(false);
    expect(esValido('simcont.carrera.v1:inventado', mes)).toBe(false);
    expect(esValido('otra.app', progreso)).toBe(false);
  });
  it('baja solo lo que falta localmente, nunca pisa lo local, y sube lo local válido', () => {
    const otroProgreso = { ...progreso, completados: {} };
    const r = fusionar({ 'simcont.progreso.v1': progreso }, [
      { clave: 'simcont.progreso.v1', datos: otroProgreso },
      { clave: 'simcont.carrera.v1:pyme-feb-2026', datos: mes },
      { clave: 'simcont.carrera.v1:pyme-feb-2026x', datos: mes },
    ]);
    expect(r.bajar.map((f) => f.clave)).toEqual(['simcont.carrera.v1:pyme-feb-2026']);
    expect(r.subir).toEqual([{ clave: 'simcont.progreso.v1', datos: progreso }]);
  });
});
