import { useState } from 'react';
import { balanza, pesos } from '../engine/contable';
import { aPagarPesos, isrResicoMensual, type ivaDelMes } from '../engine/fiscal';
import { cat, EjercicioVista, Opcion } from '../ejercicios';
import { lecciones, leccionCompleta } from '../lecciones';
import { aCentavos, type Progreso } from '../progreso';
import {
  cargarMes, evaluar, guardarMes, MESES, mesDe, nuevoEstado, presentarDeclaracion, registrarPoliza, resolver,
  sumarDias, tablaResico, tareaActual, type EstadoMes, type Mes, type Resico, type Tarea,
} from './estado';

const nombre = (cuenta: string) => cat.find((c) => c.cuenta === cuenta)?.nombre ?? cuenta;

export default function Escritorio({ progreso, irALeccion }: { progreso: Progreso; irALeccion: (id: string) => void }) {
  const [mesId, setMesId] = useState(MESES[0].id);
  return (
    <>
      <div className="secciones rutas" role="tablist" aria-label="Ruta de carrera">
        {MESES.map((m) => (
          <button key={m.id} role="tab" aria-selected={m.id === mesId} onClick={() => setMesId(m.id)}>{m.titulo}</button>
        ))}
      </div>
      <MesVista key={mesId} mes={MESES.find((m) => m.id === mesId)!} progreso={progreso} irALeccion={irALeccion} />
    </>
  );
}

function MesVista({ mes, progreso, irALeccion }: { mes: Mes; progreso: Progreso; irALeccion: (id: string) => void }) {
  const [estado, setEstado] = useState(() => cargarMes(mes));
  const [vista, setVista] = useState<'diario' | 'balanza'>('diario');
  const [aviso, setAviso] = useState('');
  // Toda acción pasa por aquí: si el motor la rechaza (p. ej. doble envío) no se pierde nada y se explica.
  const actualizar = (accion: () => EstadoMes) => {
    let e: EstadoMes;
    try { e = accion(); } catch (err) { return setAviso((err as Error).message); }
    setAviso(guardarMes(e) ? '' : 'No se pudo guardar tu avance en este navegador (modo privado o almacenamiento lleno). Usa "Exportar progreso" para no perderlo.');
    setEstado(e);
  };
  const actual = tareaActual(estado);
  const hoy = actual ? sumarDias(actual.fecha, estado.retraso) : estado.declaracion?.fecha;
  const leccion = actual && lecciones.find((l) => l.id === actual.leccion)!;
  const bloqueada = leccion && !leccionCompleta(leccion, progreso);
  const conLibro = mes.tareas.some((t) => t.tipo === 'poliza');

  return (
    <div className="escritorio">
      <header className="barra-escritorio">
        <div><strong>{mes.empresa}</strong> · {mes.regimen} · Puesto: {mes.puesto}</div>
        <div>Hoy: <strong className="cifra">{hoy}</strong> · Vence la declaración: <span className="cifra">{mes.vencimiento}</span>{estado.retraso > 0 && ` · Retraso acumulado: ${estado.retraso} día(s)`}</div>
      </header>
      {aviso && <div role="alert" className="error">{aviso}</div>}
      {mes.supuestos && (
        <details className="supuestos-mes">
          <summary>Supuestos del caso</summary>
          <ul>{mes.supuestos.map((x) => <li key={x}>{x}</li>)}</ul>
        </details>
      )}

      <div className="escritorio-cuerpo">
        <section className="bandeja" aria-label="Bandeja de entrada">
          <h2>Bandeja</h2>
          <ol>
            {mes.tareas.map((t) => (
              <li key={t.id} className={t === actual ? 'activo' : estado.tareas[t.id] ? 'hecha' : ''}>
                <span aria-hidden="true">{estado.tareas[t.id] ? '✓' : t === actual ? '●' : '○'}</span> <span className="cifra">{t.fecha.slice(5)}</span> · {t.correo.slice(0, 42)}…
              </li>
            ))}
          </ol>
        </section>

        <div className="trabajo">
          {actual && (
            <section className="correo">
              <p className="de">De: {mes.jefe} · <span className="cifra">{actual.fecha}</span></p>
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
          {!actual && <Evaluacion estado={estado} reiniciar={() => actualizar(() => nuevoEstado(mes))} />}

          {conLibro && (
            <section>
              <div className="pestanas" role="tablist">
                <button role="tab" aria-selected={vista === 'diario'} onClick={() => setVista('diario')}>Libro diario</button>
                <button role="tab" aria-selected={vista === 'balanza'} onClick={() => setVista('balanza')}>Balanza</button>
              </div>
              {vista === 'diario' ? <Diario estado={estado} /> : <Balanza estado={estado} />}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function TareaVista({ tarea, estado, actualizar }: { tarea: Tarea; estado: EstadoMes; actualizar: (accion: () => EstadoMes) => void }) {
  const mes = mesDe(estado);
  const fallo = () => actualizar(() => ({ ...estado, retraso: estado.retraso + 1 }));
  const resuelta = (ok: boolean) => actualizar(() => resolver(estado, tarea, ok));
  switch (tarea.tipo) {
    case 'poliza':
      return (
        <EjercicioVista
          ej={{ id: tarea.id, tipo: 'poliza', caso: tarea.caso!, poliza: tarea.poliza! }} hecho={false} modo="carrera"
          onIntentoFallido={fallo}
          onResultado={(_, movs) => actualizar(() => registrarPoliza(estado, tarea, movs!))}
        />
      );
    case 'calculo':
      return (
        <EjercicioVista
          ej={{ id: tarea.id, tipo: 'calculo', caso: tarea.caso!, concepto: tarea.concepto!, pregunta: tarea.pregunta! }} hecho={false} modo="carrera"
          onResultado={resuelta}
        />
      );
    case 'declaracion':
      return mes.declaracion === 'iva'
        ? <DeclaracionIva onPresentar={(d) => actualizar(() => presentarDeclaracion(estado, tarea, d))} />
        : <DeclaracionResico vencimiento={mes.vencimiento} onPresentar={(d) => actualizar(() => presentarDeclaracion(estado, tarea, d))} />;
    default:
      return (
        <section>
          <Opcion
            ej={{ id: tarea.id, pregunta: tarea.pregunta!, opciones: tarea.opciones!, correcta: tarea.correcta!, explicacion: tarea.explicacion! }}
            modo="carrera" onResultado={resuelta}
          />
        </section>
      );
  }
}

function Campo({ etiqueta, valor, onChange }: { etiqueta: string; valor: string; onChange: (v: string) => void }) {
  return (
    <label className="pregunta">{etiqueta}
      <input inputMode="decimal" value={valor} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function DeclaracionIva({ onPresentar }: { onPresentar: (iva: ReturnType<typeof ivaDelMes>) => void }) {
  const [campos, setCampos] = useState({ trasladado: '', acreditable: '', resultado: '' });
  const [tipo, setTipo] = useState<'aCargo' | 'aFavor'>('aCargo');
  const [error, setError] = useState('');

  function presentar() {
    const [t, a, r] = [campos.trasladado, campos.acreditable, campos.resultado].map(aCentavos);
    if (t === null || a === null || r === null) return setError('Escribe los importes como 1234.50');
    onPresentar({ trasladado: t, acreditable: a, aCargo: tipo === 'aCargo' ? r : 0, aFavor: tipo === 'aFavor' ? r : 0 });
  }

  return (
    <section className="portal">
      <h3>Portal fiscal simulado · Declaración mensual de IVA · Febrero 2026</h3>
      <p className="supuestos">Portal genérico con fines educativos. No es el portal de ninguna autoridad.</p>
      <Campo etiqueta="IVA trasladado efectivamente cobrado" valor={campos.trasladado} onChange={(v) => setCampos({ ...campos, trasladado: v })} />
      <Campo etiqueta="IVA acreditable efectivamente pagado" valor={campos.acreditable} onChange={(v) => setCampos({ ...campos, acreditable: v })} />
      <fieldset className="opciones">
        <legend>Resultado</legend>
        <label><input type="radio" name="tipo" checked={tipo === 'aCargo'} onChange={() => setTipo('aCargo')} /> IVA a cargo</label>
        <label><input type="radio" name="tipo" checked={tipo === 'aFavor'} onChange={() => setTipo('aFavor')} /> Saldo a favor</label>
      </fieldset>
      <Campo etiqueta="Importe del resultado" valor={campos.resultado} onChange={(v) => setCampos({ ...campos, resultado: v })} />
      <div className="acciones"><button className="primario" onClick={presentar}>Presentar declaración</button></div>
      {error && <div role="status" className="error"><p>{error}</p></div>}
    </section>
  );
}

// Sigue el flujo de la guía de pagos mensuales RESICO PF: Ingresos → Determinación → Pago → Envío (pantallas propias).
function DeclaracionResico({ vencimiento, onPresentar }: { vencimiento: string; onPresentar: (d: Resico) => void }) {
  const pasos = ['Ingresos', 'Determinación', 'Pago', 'Envío'] as const;
  const [paso, setPaso] = useState(0);
  const [campos, setCampos] = useState({ cobrado: '', devoluciones: '', retenido: '' });
  const [tasa, setTasa] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [cobrado, devoluciones, retenido] = [campos.cobrado, campos.devoluciones, campos.retenido].map(aCentavos);
  const base = cobrado !== null && devoluciones !== null ? cobrado - devoluciones : null;
  // El jugador elige la tasa (es lo que se evalúa); el resto lo calcula el portal como el real.
  const calculo = base !== null && base >= 0 && retenido !== null && tasa !== null
    ? isrResicoMensual(base, [{ limite_inferior: 0, limite_superior: Number.MAX_SAFE_INTEGER, tasa_pct: tasa }], retenido) : null;
  const tasas = [...new Set(tablaResico.map((r) => r.tasa_pct))];

  function siguiente() {
    if (paso === 0 && (base === null || base < 0)) return setError('Revisa los importes de ingresos.');
    if (paso === 1 && !calculo) return setError('Captura el ISR retenido y elige la tasa aplicable.');
    setError('');
    setPaso(paso + 1);
  }

  return (
    <section className="portal">
      <h3>Portal fiscal simulado · ISR RESICO personas físicas · Marzo 2026</h3>
      <p className="supuestos">Portal genérico con fines educativos. No es el portal de ninguna autoridad.</p>
      <ol className="pasos" aria-label="Pasos de la declaración">
        {pasos.map((p, i) => <li key={p} aria-current={i === paso ? 'step' : undefined} className={i < paso ? 'hecha' : ''}>{p}</li>)}
      </ol>

      {paso === 0 && (
        <>
          <Campo etiqueta="Total de ingresos efectivamente cobrados (sin IVA)" valor={campos.cobrado} onChange={(v) => setCampos({ ...campos, cobrado: v })} />
          <Campo etiqueta="Descuentos, devoluciones y bonificaciones" valor={campos.devoluciones} onChange={(v) => setCampos({ ...campos, devoluciones: v })} />
          {base !== null && <p>Total de ingresos percibidos por la actividad: <strong className="cifra">{pesos(base)}</strong></p>}
        </>
      )}
      {paso === 1 && (
        <>
          <p>Base gravable: <strong className="cifra">{pesos(base!)}</strong></p>
          <label className="pregunta">Tasa aplicable
            <select value={tasa ?? ''} onChange={(e) => setTasa(e.target.value === '' ? null : Number(e.target.value))}>
              <option value="">Elige…</option>
              {tasas.map((t) => <option key={t} value={t}>{t.toFixed(2)} %</option>)}
            </select>
          </label>
          <Campo etiqueta="ISR retenido por personas morales" valor={campos.retenido} onChange={(v) => setCampos({ ...campos, retenido: v })} />
          {calculo && (
            <p>Impuesto mensual: <strong className="cifra">{pesos(calculo.impuesto)}</strong> · {calculo.excedente ? 'Excedente de retenciones' : 'Impuesto a cargo'}: <strong className="cifra">{pesos(calculo.excedente || calculo.aCargo)}</strong></p>
          )}
        </>
      )}
      {paso === 2 && calculo && (
        <p>{calculo.excedente
          ? <>Excedente de retenciones: <strong className="cifra">{pesos(calculo.excedente)}</strong> (resultado aritmético; su tratamiento debe validarse)</>
          : <>Impuesto a cargo: <span className="cifra">{pesos(calculo.aCargo)}</span> · Cantidad a pagar (pesos, art. 20 CFF): <strong className="cifra">${aPagarPesos(calculo.aCargo).toLocaleString('es-MX')}</strong> · Línea de captura vigente hasta el <span className="cifra">{vencimiento}</span></>}</p>
      )}
      {paso === 3 && <p>Revisa la información. Al enviar se genera el acuse y ya no podrás modificar esta declaración (solo con una complementaria).</p>}

      <div className="acciones">
        {paso > 0 && <button onClick={() => setPaso(paso - 1)}>Anterior</button>}
        {paso < 3
          ? <button className="primario" onClick={siguiente}>Siguiente</button>
          : <button className="primario" onClick={() => { const { alerta: _, ...c } = calculo!; onPresentar({ cobrado: cobrado!, devoluciones: devoluciones!, ...c }); }}>Enviar declaración</button>}
      </div>
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
  const mes = mesDe(estado);
  const ev = evaluar(estado);
  const fila = (ok: boolean | null, dim: string, detalle: string) => (
    <li className={ok === null ? 'pendiente' : ok ? 'ok' : 'error'}>
      <span aria-hidden="true">{ok === null ? '○' : ok ? '✓' : '✗'}</span> <strong>{dim}:</strong> {detalle}
    </li>
  );
  const fiscal = ev.fiscal.correcta
    ? 'la declaración es correcta'
    : ev.fiscal.coherente ? 'la declaración coincide con tu libro, pero tu libro tiene errores' : 'la declaración no es correcta';
  return (
    <section>
      <h3>Revisión del cierre</h3>
      <ul className="evaluacion">
        {fila(ev.registro.correctas === ev.registro.total, 'Registro', `${ev.registro.correctas} de ${ev.registro.total} tareas de trabajo correctas`)}
        {fila(ev.control, 'Control', ev.control === null ? 'no se evalúa este mes' : ev.control ? 'detectaste y corregiste el error' : 'el error no se corrigió bien')}
        {fila(ev.fiscal.correcta, 'Tratamiento fiscal', fiscal)}
        {fila(ev.cumplimiento, 'Cumplimiento', `declaración presentada el ${estado.declaracion?.fecha} (vence ${mes.vencimiento})`)}
        {fila(ev.comunicacion, 'Comunicación', ev.comunicacion ? `comunicaste bien el resultado (${mes.jefe})` : `tu mensaje (${mes.jefe}) no fue adecuado`)}
        {fila(null, 'Evidencia', 'se evaluará en fases posteriores')}
      </ul>
      <button onClick={reiniciar}>Repetir el mes</button>
    </section>
  );
}
