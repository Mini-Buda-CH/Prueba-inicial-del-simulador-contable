import { useState } from 'react';
import { balanza, pesos } from '../engine/contable';
import { ivaDelMes } from '../engine/fiscal';
import { cat, EjercicioVista, Opcion } from '../ejercicios';
import { lecciones, leccionCompleta } from '../lecciones';
import { aCentavos, type Progreso } from '../progreso';
import { cargarMes, evaluar, guardarMes, MES, nuevoEstado, presentarDeclaracion, registrarPoliza, sumarDias, tareaActual, type EstadoMes, type Tarea } from './estado';

const nombre = (cuenta: string) => cat.find((c) => c.cuenta === cuenta)?.nombre ?? cuenta;

export default function Escritorio({ progreso, irALeccion }: { progreso: Progreso; irALeccion: (id: string) => void }) {
  const [estado, setEstado] = useState(cargarMes);
  const [vista, setVista] = useState<'diario' | 'balanza'>('diario');
  const actualizar = (e: EstadoMes) => { guardarMes(e); setEstado(e); };
  const actual = tareaActual(estado);
  const hoy = actual ? sumarDias(actual.fecha, estado.retraso) : estado.declaracion?.fecha;
  const leccion = actual && lecciones.find((l) => l.id === actual.leccion)!;
  const bloqueada = leccion && !leccionCompleta(leccion, progreso);

  return (
    <div className="escritorio">
      <header className="barra-escritorio">
        <div><strong>{MES.empresa}</strong> · {MES.regimen} · Puesto: {MES.puesto}</div>
        <div>📅 Hoy: <strong>{hoy}</strong> · IVA vence: {MES.vencimiento_iva}{estado.retraso > 0 && ` · Retraso acumulado: ${estado.retraso} día(s)`}</div>
      </header>

      <div className="escritorio-cuerpo">
        <section className="bandeja" aria-label="Bandeja de entrada">
          <h2>Bandeja</h2>
          <ol>
            {MES.tareas.map((t) => (
              <li key={t.id} className={t === actual ? 'activo' : estado.tareas[t.id] ? 'hecha' : ''}>
                {estado.tareas[t.id] ? '✓' : t === actual ? '●' : '○'} {t.fecha.slice(5)} · {t.correo.slice(0, 42)}…
              </li>
            ))}
          </ol>
        </section>

        <div className="trabajo">
          {actual && (
            <section className="correo">
              <p className="de">De: {MES.jefe} · {actual.fecha}</p>
              <p>{actual.correo}</p>
            </section>
          )}
          {actual && bloqueada && (
            <section>
              <p>Para hacer esta tarea primero completa la lección <strong>{leccion!.titulo}</strong> en la Academia.</p>
              <button className="primario" onClick={() => irALeccion(leccion!.id)}>Ir a la lección</button>
            </section>
          )}
          {actual && !bloqueada && <TareaVista key={actual.id} tarea={actual} estado={estado} actualizar={actualizar} />}
          {!actual && <Evaluacion estado={estado} reiniciar={() => actualizar(nuevoEstado())} />}

          <section>
            <div className="pestanas" role="tablist">
              <button role="tab" aria-selected={vista === 'diario'} onClick={() => setVista('diario')}>Libro diario</button>
              <button role="tab" aria-selected={vista === 'balanza'} onClick={() => setVista('balanza')}>Balanza</button>
            </div>
            {vista === 'diario' ? <Diario estado={estado} /> : <Balanza estado={estado} />}
          </section>
        </div>
      </div>
    </div>
  );
}

function TareaVista({ tarea, estado, actualizar }: { tarea: Tarea; estado: EstadoMes; actualizar: (e: EstadoMes) => void }) {
  const fallo = () => actualizar({ ...estado, retraso: estado.retraso + 1 });
  if (tarea.tipo === 'poliza')
    return (
      <EjercicioVista
        ej={{ id: tarea.id, tipo: 'poliza', caso: tarea.caso!, poliza: tarea.poliza! }} hecho={false} modo="carrera"
        onIntentoFallido={fallo}
        onResultado={(_, movs) => actualizar(registrarPoliza(estado, tarea, movs!))}
      />
    );
  if (tarea.tipo === 'declaracion') return <Declaracion onPresentar={(iva) => actualizar(presentarDeclaracion(estado, tarea, iva))} />;
  return (
    <section>
      <Opcion
        ej={{ id: tarea.id, pregunta: tarea.pregunta!, opciones: tarea.opciones!, correcta: tarea.correcta!, explicacion: tarea.explicacion! }}
        modo="carrera"
        onResultado={(ok) => actualizar({ ...estado, tareas: { ...estado.tareas, [tarea.id]: { ok, fecha: sumarDias(tarea.fecha, estado.retraso) } } })}
      />
    </section>
  );
}

function Declaracion({ onPresentar }: { onPresentar: (iva: ReturnType<typeof ivaDelMes>) => void }) {
  const [campos, setCampos] = useState({ trasladado: '', acreditable: '', resultado: '' });
  const [tipo, setTipo] = useState<'aCargo' | 'aFavor'>('aCargo');
  const [error, setError] = useState('');

  function presentar() {
    const [t, a, r] = [campos.trasladado, campos.acreditable, campos.resultado].map(aCentavos);
    if (t === null || a === null || r === null) return setError('Escribe los importes como 1234.50');
    onPresentar({ trasladado: t, acreditable: a, aCargo: tipo === 'aCargo' ? r : 0, aFavor: tipo === 'aFavor' ? r : 0 });
  }
  const campo = (k: keyof typeof campos, etiqueta: string) => (
    <label className="pregunta">{etiqueta}
      <input inputMode="decimal" value={campos[k]} onChange={(e) => setCampos({ ...campos, [k]: e.target.value })} />
    </label>
  );

  return (
    <section className="portal">
      <h3>Portal fiscal simulado · Declaración mensual de IVA · Febrero 2026</h3>
      <p className="supuestos">Portal genérico con fines educativos. No es el portal de ninguna autoridad.</p>
      {campo('trasladado', 'IVA trasladado efectivamente cobrado')}
      {campo('acreditable', 'IVA acreditable efectivamente pagado')}
      <fieldset className="opciones">
        <legend>Resultado</legend>
        <label><input type="radio" name="tipo" checked={tipo === 'aCargo'} onChange={() => setTipo('aCargo')} /> IVA a cargo</label>
        <label><input type="radio" name="tipo" checked={tipo === 'aFavor'} onChange={() => setTipo('aFavor')} /> Saldo a favor</label>
      </fieldset>
      {campo('resultado', 'Importe del resultado')}
      <div className="acciones"><button className="primario" onClick={presentar}>Presentar declaración</button></div>
      {error && <div role="status" className="error"><p>{error}</p></div>}
    </section>
  );
}

function Diario({ estado }: { estado: EstadoMes }) {
  return (
    <table className="libro">
      <thead><tr><th>Póliza</th><th>Cuenta</th><th>Cargo</th><th>Abono</th></tr></thead>
      <tbody>
        {estado.movimientos.map((m, i) => (
          <tr key={i}><td>{m.poliza}</td><td>{nombre(m.cuenta)}</td><td>{m.cargo ? pesos(m.cargo) : ''}</td><td>{m.abono ? pesos(m.abono) : ''}</td></tr>
        ))}
      </tbody>
    </table>
  );
}

function Balanza({ estado }: { estado: EstadoMes }) {
  const filas = [...balanza(estado.movimientos, cat)].sort(([a], [b]) => a.localeCompare(b));
  return (
    <table className="libro">
      <thead><tr><th>Cuenta</th><th>Cargos</th><th>Abonos</th><th>Saldo</th></tr></thead>
      <tbody>
        {filas.map(([cuenta, s]) => (
          <tr key={cuenta}><td>{nombre(cuenta)}</td><td>{pesos(s.cargos)}</td><td>{pesos(s.abonos)}</td><td>{pesos(s.saldo)}</td></tr>
        ))}
      </tbody>
    </table>
  );
}

function Evaluacion({ estado, reiniciar }: { estado: EstadoMes; reiniciar: () => void }) {
  const ev = evaluar(estado);
  const fila = (ok: boolean, dim: string, detalle: string) => <li className={ok ? 'ok' : 'error'}>{ok ? '✓' : '✗'} <strong>{dim}:</strong> {detalle}</li>;
  return (
    <section>
      <h3>Revisión del cierre de febrero</h3>
      <ul className="evaluacion">
        {fila(ev.registro.correctas === ev.registro.total, 'Registro', `${ev.registro.correctas} de ${ev.registro.total} pólizas correctas`)}
        {fila(ev.control, 'Control', ev.control ? 'detectaste y revertiste el gasto duplicado' : 'el gasto duplicado no se corrigió bien')}
        {fila(ev.fiscal.correcta, 'Tratamiento fiscal', ev.fiscal.correcta ? 'la declaración de IVA es correcta' : ev.fiscal.coherente ? 'la declaración coincide con tu libro, pero tu libro tiene errores' : 'la declaración no coincide ni con tu libro')}
        {fila(ev.cumplimiento, 'Cumplimiento', `declaración presentada el ${estado.declaracion?.fecha} (vence ${MES.vencimiento_iva})`)}
        {fila(ev.comunicacion, 'Comunicación', ev.comunicacion ? 'informaste bien a tu jefa' : 'tu mensaje a la jefa no fue adecuado')}
        <li className="pendiente">○ <strong>Evidencia:</strong> se evaluará en fases posteriores</li>
      </ul>
      <button onClick={reiniciar}>Repetir el mes</button>
    </section>
  );
}
