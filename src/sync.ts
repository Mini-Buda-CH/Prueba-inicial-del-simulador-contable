// Punto único de aviso "se guardó algo": progreso.ts y carrera/estado.ts avisan; nube.ts escucha. Evita dependencias circulares.
let destino: ((clave: string, datos: unknown) => void) | null = null;
export const alGuardar = (f: typeof destino) => { destino = f; };
export const avisarGuardado = (clave: string, datos: unknown) => destino?.(clave, datos);
