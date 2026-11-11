import { useState } from 'react';
import casosPm from '../content/casos.json';
import casosResico from '../content/casos_resico.json';
import catalogo from '../content/catalogo.json';
import { mismaPoliza, validarPoliza, type Cuenta, type Movimiento } from './engine/contable';
import type { Ejercicio } from './lecciones';
import { aCentavos } from './progreso';

export const cat = catalogo as Cuenta[];
const casos = [...casosPm, ...casosResico];
export const caso = (id: string) => casos.find((c) => c.id === id)!;
const xmls = import.meta.glob('../datos/originales/paquete_contable_2026/04_xml/*.xml', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const xml = (archivo: string) => xmls[`../datos/originales/paquete_contable_2026/04_xml/${archivo}`];

/** practica: reintentar hasta acertar · examen: un intento · carrera: se acepta toda póliza que cuadre (el error se descubre al cierre). */
export type Modo = 'practica' | 'examen' | 'carrera';
type Props = { modo: Modo; onResultado: (ok: boolean, movs?: Movimiento[]) => void; onIntentoFallido?: () => void };
type Aviso = { ok: boolean; textos: string[] } | null;

function Mensajes({ aviso }: { aviso: Aviso }) {
  return aviso && (
    <div role="status" className={aviso.ok ? 'ok' : 'error'}>
      {aviso.textos.map((t) => <p key={t}>{t}</p>)}
    </div>
  );
}

export function EjercicioVista({ ej, hecho, ...props }: Props & { ej: Ejercicio; hecho: boolean }) {
  const c = 'caso' in ej && ej.caso ? caso(ej.caso) : null;
  return (
    <section className="ejercicio">
      {c && <h3>Caso {c.id}: {c.titulo} {hecho && <span className="insignia">Completado</span>}</h3>}
      {!c && hecho && <span className="insignia">Completado</span>}
      {c && <p className="enunciado">{c.enunciado}</p>}
      {c && <p className="supuestos"><strong>Supuestos:</strong> {c.supuestos}</p>}
      {ej.tipo === 'opcion' && ej.xml && <pre className="xml" tabIndex={0} aria-label={`XML ${ej.xml}`}>{xml(ej.xml)}</pre>}
      {ej.tipo === 'poliza' && <Poliza casoId={ej.caso} poliza={ej.poliza} {...props} />}
      {ej.tipo === 'calculo' && <Calculo casoId={ej.caso} concepto={ej.concepto} pregunta={ej.pregunta} {...props} />}
      {ej.tipo === 'opcion' && <Opcion ej={ej} {...props} />}
    </section>
  );
}

type Renglon = { cuenta: string; cargo: string; abono: string };
const vacio = (): Renglon => ({ cuenta: '', cargo: '', abono: '' });

export function Poliza({ casoId, poliza, modo, onResultado, onIntentoFallido }: Props & { casoId: string; poliza: string }) {
  const solucion = (caso(casoId).movimientos as Movimiento[]).filter((m) => m.poliza === poliza);
  const [renglones, setRenglones] = useState<Renglon[]>([vacio(), vacio()]);
  const [aviso, setAviso] = useState<Aviso>(null);
  const [cerrado, setCerrado] = useState(false);
  const cambiar = (i: number, campo: keyof Renglon, valor: string) =>
    setRenglones((rs) => rs.map((r, j) => (j === i ? { ...r, [campo]: valor } : r)));

  function revisar() {
    const errores: string[] = [];
    const movs: Movimiento[] = renglones
      .filter((r) => r.cuenta || r.cargo || r.abono)
      .map((r, i) => {
        const cargo = aCentavos(r.cargo), abono = aCentavos(r.abono);
        if (cargo === null || abono === null) errores.push(`Renglón ${i + 1}: escribe importes como 1234.50`);
        return { poliza, cuenta: r.cuenta, cargo: cargo ?? 0, abono: abono ?? 0 };
      });
    errores.push(...validarPoliza(movs, cat));
    const ok = !errores.length && mismaPoliza(movs, solucion);
    if (modo === 'examen') {
      setCerrado(true);
      setAviso({ ok, textos: [ok ? 'Correcta.' : 'Incorrecta.', ...errores] });
      return onResultado(ok);
    }
    if (errores.length) {
      onIntentoFallido?.();
      return setAviso({ ok: false, textos: modo === 'carrera' ? [...errores, 'El retrabajo te cuesta un día.'] : errores });
    }
    if (modo === 'carrera') {
      setCerrado(true);
      setAviso({ ok: true, textos: ['Póliza registrada en el libro.'] });
      return onResultado(ok, movs);
    }
    if (!ok) return setAviso({ ok: false, textos: ['La póliza cuadra, pero las cuentas o importes no corresponden a la operación. Revisa el IVA y la naturaleza de cada cuenta.'] });
    setCerrado(true);
    setAviso({ ok: true, textos: ['¡Correcto! La póliza está bien registrada.'] });
    onResultado(true, movs);
  }

  return (
    <>
      <p>Registra la póliza <strong>{poliza}</strong>.</p>
      <table>
        <thead><tr><th>Cuenta</th><th>Cargo</th><th>Abono</th><th /></tr></thead>
        <tbody>
          {renglones.map((r, i) => (
            <tr key={i}>
              <td>
                <select aria-label={`Cuenta renglón ${i + 1}`} value={r.cuenta} disabled={cerrado} onChange={(e) => cambiar(i, 'cuenta', e.target.value)}>
                  <option value="">Elige cuenta…</option>
                  {cat.map((c) => <option key={c.cuenta} value={c.cuenta}>{c.agrupador} · {c.nombre}</option>)}
                </select>
              </td>
              <td><input aria-label={`Cargo renglón ${i + 1}`} inputMode="decimal" value={r.cargo} disabled={cerrado} onChange={(e) => cambiar(i, 'cargo', e.target.value)} /></td>
              <td><input aria-label={`Abono renglón ${i + 1}`} inputMode="decimal" value={r.abono} disabled={cerrado} onChange={(e) => cambiar(i, 'abono', e.target.value)} /></td>
              <td><button aria-label={`Quitar renglón ${i + 1}`} disabled={cerrado} onClick={() => setRenglones((rs) => rs.filter((_, j) => j !== i))}>✕</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {!cerrado && (
        <div className="acciones">
          <button onClick={() => setRenglones((rs) => [...rs, vacio()])}>+ Renglón</button>
          <button className="primario" onClick={revisar}>{modo === 'carrera' ? 'Registrar póliza' : 'Revisar póliza'}</button>
        </div>
      )}
      <Mensajes aviso={aviso} />
    </>
  );
}

function Calculo({ casoId, concepto, pregunta, modo, onResultado }: Props & { casoId: string; concepto: string; pregunta: string }) {
  const resultado = caso(casoId).resultados.find((r) => r.concepto === concepto)! as { valor: number; unidad?: 'pct' };
  // Las tasas se capturan como porcentaje (1.5), no como dinero
  const leer = (t: string) => (resultado.unidad === 'pct' ? (/^\d+(\.\d+)?$/.test(t.trim()) ? Number(t) : null) : aCentavos(t));
  const [valor, setValor] = useState('');
  const [aviso, setAviso] = useState<Aviso>(null);
  const [cerrado, setCerrado] = useState(false);

  function revisar() {
    const c = leer(valor);
    if (c === null) return setAviso({ ok: false, textos: [resultado.unidad === 'pct' ? 'Escribe el porcentaje como 1.5' : 'Escribe un importe como 1234.50'] });
    const ok = c === resultado.valor;
    if (modo !== 'practica' || ok) setCerrado(true);
    setAviso({ ok, textos: [ok ? '¡Correcto!' : modo !== 'practica' ? 'Incorrecto.' : 'No es correcto; revisa el procedimiento.'] });
    if (modo !== 'practica' || ok) onResultado(ok);
  }

  return (
    <>
      <label className="pregunta">{pregunta}
        <input inputMode="decimal" value={valor} disabled={cerrado} onChange={(e) => setValor(e.target.value)} />
      </label>
      {!cerrado && <div className="acciones"><button className="primario" onClick={revisar}>Revisar</button></div>}
      <Mensajes aviso={aviso} />
    </>
  );
}

export function Opcion({ ej, modo, onResultado }: Props & { ej: Pick<Extract<Ejercicio, { tipo: 'opcion' }>, 'id' | 'pregunta' | 'opciones' | 'correcta' | 'explicacion'> }) {
  const [elegida, setElegida] = useState<number | null>(null);
  const [aviso, setAviso] = useState<Aviso>(null);
  const [cerrado, setCerrado] = useState(false);

  function revisar() {
    if (elegida === null) return setAviso({ ok: false, textos: ['Elige una opción.'] });
    const ok = elegida === ej.correcta;
    if (modo !== 'practica' || ok) setCerrado(true);
    setAviso({ ok, textos: ok || modo !== 'practica' ? [ok ? '¡Correcto!' : 'Incorrecto.', ej.explicacion] : ['No es la mejor respuesta; inténtalo de nuevo.'] });
    if (modo !== 'practica' || ok) onResultado(ok);
  }

  return (
    <fieldset className="opciones">
      <legend>{ej.pregunta}</legend>
      {ej.opciones.map((o, i) => (
        <label key={o}>
          <input type="radio" name={ej.id} checked={elegida === i} disabled={cerrado} onChange={() => setElegida(i)} /> {o}
        </label>
      ))}
      {!cerrado && <div className="acciones"><button className="primario" onClick={revisar}>Responder</button></div>}
      <Mensajes aviso={aviso} />
    </fieldset>
  );
}
