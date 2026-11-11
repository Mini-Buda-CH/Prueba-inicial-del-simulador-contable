import { useState } from 'react';
import casos from '../content/casos.json';
import catalogo from '../content/catalogo.json';
import { mismaPoliza, validarPoliza, type Cuenta, type Movimiento } from './engine/contable';
import { lecciones, totalEjercicios, type Ejercicio } from './lecciones';
import { aCentavos, cargar, guardar } from './progreso';

const cat = catalogo as Cuenta[];
type Renglon = { cuenta: string; cargo: string; abono: string };
const vacio = (): Renglon => ({ cuenta: '', cargo: '', abono: '' });

export default function App() {
  const [progreso, setProgreso] = useState(cargar);
  const todos = lecciones.flatMap((l) => l.ejercicios);
  const siguiente = todos.find((e) => !progreso.completados[e.id]) ?? todos[0];
  const [actual, setActual] = useState<Ejercicio>(siguiente);
  const hechos = Object.keys(progreso.completados).length;
  const leccion = lecciones.find((l) => l.ejercicios.includes(actual))!;

  function completar(id: string) {
    const p = { ...progreso, completados: { ...progreso.completados, [id]: new Date().toISOString() } };
    guardar(p);
    setProgreso(p);
  }

  return (
    <div className="app">
      <aside className="lateral">
        <h1>Simulador Contable MX</h1>
        <div className="avance" aria-label="Avance del curso">
          <div className="barra"><span style={{ width: `${(hechos / totalEjercicios) * 100}%` }} /></div>
          <p>{Math.round((hechos / totalEjercicios) * 100)}% · {hechos} de {totalEjercicios} ejercicios</p>
        </div>
        <button className="primario" onClick={() => setActual(siguiente)}>Continuar →</button>
        {lecciones.map((l) => (
          <nav key={l.id}>
            <h2>{l.modulo}</h2>
            <p className="titulo-leccion">{l.titulo}</p>
            <ol>
              {l.ejercicios.map((e, i) => (
                <li key={e.id}>
                  <button className={e.id === actual.id ? 'activo' : ''} onClick={() => setActual(e)}>
                    {progreso.completados[e.id] ? '✓' : '○'} Ejercicio {i + 1}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        ))}
        <p className="aviso">Material educativo 2026 v0.1, pendiente de validación profesional. No usar para declarar.</p>
      </aside>

      <main>
        <section className="teoria">
          <h2>{leccion.titulo}</h2>
          {leccion.teoria.map((t) => <p key={t}>{t}</p>)}
        </section>
        <Captura key={actual.id} ejercicio={actual} hecho={!!progreso.completados[actual.id]} onCorrecto={() => completar(actual.id)} />
      </main>
    </div>
  );
}

function Captura({ ejercicio, hecho, onCorrecto }: { ejercicio: Ejercicio; hecho: boolean; onCorrecto: () => void }) {
  const caso = casos.find((c) => c.id === ejercicio.caso)!;
  const solucion = (caso.movimientos as Movimiento[]).filter((m) => m.poliza === ejercicio.poliza);
  const [renglones, setRenglones] = useState<Renglon[]>([vacio(), vacio()]);
  const [mensajes, setMensajes] = useState<{ ok: boolean; textos: string[] } | null>(null);

  const cambiar = (i: number, campo: keyof Renglon, valor: string) =>
    setRenglones((rs) => rs.map((r, j) => (j === i ? { ...r, [campo]: valor } : r)));

  function revisar() {
    const errores: string[] = [];
    const movs: Movimiento[] = renglones
      .filter((r) => r.cuenta || r.cargo || r.abono)
      .map((r, i) => {
        const cargo = aCentavos(r.cargo), abono = aCentavos(r.abono);
        if (cargo === null || abono === null) errores.push(`Renglón ${i + 1}: escribe importes como 1234.50`);
        return { poliza: ejercicio.poliza, cuenta: r.cuenta, cargo: cargo ?? 0, abono: abono ?? 0 };
      });
    errores.push(...validarPoliza(movs, cat));
    if (errores.length) return setMensajes({ ok: false, textos: errores });
    if (!mismaPoliza(movs, solucion))
      return setMensajes({ ok: false, textos: ['La póliza cuadra, pero las cuentas o importes no corresponden a la operación. Revisa el IVA y la naturaleza de cada cuenta.'] });
    setMensajes({ ok: true, textos: ['¡Correcto! La póliza está bien registrada.'] });
    onCorrecto();
  }

  return (
    <section className="ejercicio">
      <h3>Caso {caso.id}: {caso.titulo} {hecho && <span className="insignia">Completado</span>}</h3>
      <p className="enunciado">{caso.enunciado}</p>
      <p className="supuestos"><strong>Supuestos:</strong> {caso.supuestos}</p>
      <p>Registra la póliza <strong>{ejercicio.poliza}</strong>.</p>

      <table>
        <thead><tr><th>Cuenta</th><th>Cargo</th><th>Abono</th><th /></tr></thead>
        <tbody>
          {renglones.map((r, i) => (
            <tr key={i}>
              <td>
                <select aria-label={`Cuenta renglón ${i + 1}`} value={r.cuenta} onChange={(e) => cambiar(i, 'cuenta', e.target.value)}>
                  <option value="">Elige cuenta…</option>
                  {cat.map((c) => <option key={c.cuenta} value={c.cuenta}>{c.agrupador} · {c.nombre}</option>)}
                </select>
              </td>
              <td><input aria-label={`Cargo renglón ${i + 1}`} inputMode="decimal" value={r.cargo} onChange={(e) => cambiar(i, 'cargo', e.target.value)} /></td>
              <td><input aria-label={`Abono renglón ${i + 1}`} inputMode="decimal" value={r.abono} onChange={(e) => cambiar(i, 'abono', e.target.value)} /></td>
              <td><button aria-label={`Quitar renglón ${i + 1}`} onClick={() => setRenglones((rs) => rs.filter((_, j) => j !== i))}>✕</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="acciones">
        <button onClick={() => setRenglones((rs) => [...rs, vacio()])}>+ Renglón</button>
        <button className="primario" onClick={revisar}>Revisar póliza</button>
      </div>
      {mensajes && (
        <div role="status" className={mensajes.ok ? 'ok' : 'error'}>
          {mensajes.textos.map((t) => <p key={t}>{t}</p>)}
        </div>
      )}
    </section>
  );
}
