import { useState } from 'react';
import Escritorio from './carrera/Escritorio';
import { EjercicioVista } from './ejercicios';
import { APROBATORIO, leccionCompleta, lecciones, type Leccion } from './lecciones';
import { cargar, guardar, type Progreso } from './progreso';

const practicas = lecciones.filter((l) => !l.examen).flatMap((l) => l.ejercicios);
const examenes = lecciones.filter((l) => l.examen);

export default function App() {
  const [progreso, setProgreso] = useState(cargar);
  const [seccion, setSeccion] = useState<'academia' | 'carrera'>('academia');
  const pendiente = lecciones.find((l) => !leccionCompleta(l, progreso)) ?? lecciones[0];
  const [actual, setActual] = useState<Leccion>(pendiente);
  const hechos = practicas.filter((e) => progreso.completados[e.id]).length;
  const aprobados = examenes.filter((l) => leccionCompleta(l, progreso)).length;
  const pct = Math.round(((hechos + aprobados) / (practicas.length + examenes.length)) * 100);

  const actualizar = (p: Progreso) => { guardar(p); setProgreso(p); };
  const irA = (l: Leccion) => { setActual(l); setSeccion('academia'); };

  return (
    <div className="app">
      <aside className="lateral">
        <h1 className="marca">
          <picture>
            <source srcSet="/logo-claro.png" media="(prefers-color-scheme: dark)" />
            <img src="/logo-oscuro.png" alt="" width="36" height="36" />
          </picture>
          De 0 a CFO
        </h1>
        <div className="secciones" role="tablist">
          <button role="tab" aria-selected={seccion === 'academia'} onClick={() => setSeccion('academia')}>Academia</button>
          <button role="tab" aria-selected={seccion === 'carrera'} onClick={() => setSeccion('carrera')}>Carrera</button>
        </div>
        <div className="avance" aria-label="Avance del curso">
          <div className="barra"><span style={{ width: `${pct}%` }} /></div>
          <p>{pct}% · {hechos} ejercicios · {aprobados} exámenes</p>
        </div>
        <button className="primario" onClick={() => irA(pendiente)}>Continuar →</button>
        {[...new Set(lecciones.map((l) => l.modulo))].map((m) => (
          <nav key={m} aria-label={m}>
            <h2>{m}</h2>
            <ol>
              {lecciones.filter((l) => l.modulo === m).map((l) => (
                <li key={l.id}>
                  <button className={seccion === 'academia' && l.id === actual.id ? 'activo' : ''} onClick={() => irA(l)}>
                    {leccionCompleta(l, progreso) ? '✓' : '○'} {l.examen ? `Examen · ${l.titulo.replace('Examen: ', '')}` : l.titulo}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        ))}
        <p className="aviso">Material educativo 2026 v0.1, pendiente de validación profesional. No usar para declarar.</p>
      </aside>

      <main>
        {seccion === 'carrera'
          ? <Escritorio progreso={progreso} irALeccion={(id) => irA(lecciones.find((l) => l.id === id)!)} />
          : actual.examen
            ? <Examen key={actual.id} leccion={actual} mejor={progreso.examenes[actual.id]} onTerminar={(pctEx) =>
                actualizar({ ...progreso, examenes: { ...progreso.examenes, [actual.id]: Math.max(pctEx, progreso.examenes[actual.id] ?? 0) } })} />
            : <LeccionVista key={actual.id} leccion={actual} progreso={progreso} onCompletar={(id) =>
                actualizar({ ...progreso, completados: { ...progreso.completados, [id]: new Date().toISOString() } })} />}
      </main>
    </div>
  );
}

function LeccionVista({ leccion, progreso, onCompletar }: { leccion: Leccion; progreso: Progreso; onCompletar: (id: string) => void }) {
  return (
    <>
      <section className="teoria">
        <p className="supuestos">{leccion.modulo}{leccion.estado === 'PENDIENTE_VALIDACION' && ' · Contenido pendiente de validación'}</p>
        <h2>{leccion.titulo}</h2>
        {leccion.teoria.map((t) => <p key={t}>{t}</p>)}
      </section>
      {leccion.ejercicios.map((ej) => (
        <EjercicioVista key={ej.id} ej={ej} hecho={!!progreso.completados[ej.id]} modo="practica" onResultado={(ok) => ok && onCompletar(ej.id)} />
      ))}
    </>
  );
}

function Examen({ leccion, mejor, onTerminar }: { leccion: Leccion; mejor?: number; onTerminar: (pct: number) => void }) {
  const [intento, setIntento] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<string, boolean>>({});
  const total = leccion.ejercicios.length;
  const contestadas = Object.keys(respuestas).length;
  const pct = Math.round((Object.values(respuestas).filter(Boolean).length / total) * 100);

  function responder(id: string, ok: boolean) {
    const r = { ...respuestas, [id]: ok };
    setRespuestas(r);
    if (Object.keys(r).length === total) onTerminar(Math.round((Object.values(r).filter(Boolean).length / total) * 100));
  }

  return (
    <div key={intento}>
      <section className="teoria">
        <h2>{leccion.titulo}</h2>
        {leccion.teoria.map((t) => <p key={t}>{t}</p>)}
        {mejor !== undefined && <p>Mejor resultado: {mejor}% {mejor >= APROBATORIO ? '· Aprobado' : ''}</p>}
      </section>
      {leccion.ejercicios.map((ej) => (
        <EjercicioVista key={ej.id} ej={ej} hecho={false} modo="examen" onResultado={(ok) => responder(ej.id, ok)} />
      ))}
      {contestadas === total && (
        <section role="status" className={pct >= APROBATORIO ? 'ok' : 'error'}>
          <h3>Resultado: {pct}% {pct >= APROBATORIO ? '· ¡Aprobado!' : `· Necesitas ${APROBATORIO}%`}</h3>
          <button onClick={() => { setRespuestas({}); setIntento((n) => n + 1); }}>Reintentar examen</button>
        </section>
      )}
    </div>
  );
}
