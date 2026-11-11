# Configurar cuentas (Google y GitHub) con Supabase

La app ya tiene el código: mientras no existan estas variables, funciona sin cuentas y guarda el progreso solo en el navegador. Al terminar estos pasos aparecen los botones "Entrar con Google" y "Entrar con GitHub", y el progreso se replica en la nube.

URL pública de la app (GitHub Pages): `https://mini-buda-ch.github.io/Prueba-inicial-del-simulador-contable/`

## 1. Proyecto de Supabase
1. Crea un proyecto en supabase.com (plan gratuito).
2. En **SQL Editor**, ejecuta `supabase/esquema.sql`. Crea la tabla `progreso` con seguridad por fila: cada usuario solo ve lo suyo.
3. En **Authentication → URL Configuration**:
   - **Site URL:** la URL pública de arriba.
   - **Redirect URLs:** la misma URL y `http://localhost:5173/` (para desarrollo).
4. Anota la **Project URL** (`https://xxxx.supabase.co`), que también usarás en los pasos 2 y 3, y la **anon public key** (Project Settings → API).

## 2. Google
1. En Google Cloud Console → APIs y servicios → Credenciales, crea un **ID de cliente de OAuth** (aplicación web).
2. **URI de redireccionamiento autorizado:** `https://xxxx.supabase.co/auth/v1/callback`.
3. Copia el Client ID y el Client Secret en Supabase → **Authentication → Providers → Google** y actívalo.

## 3. GitHub
1. En GitHub → Settings → Developer settings → **OAuth Apps → New OAuth App**.
2. **Homepage URL:** la URL pública. **Authorization callback URL:** `https://xxxx.supabase.co/auth/v1/callback`.
3. Copia el Client ID y genera un Client Secret; pégalos en Supabase → **Authentication → Providers → GitHub** y actívalo.

Los Client Secret de Google y GitHub se guardan **solo en Supabase**: nunca en el repositorio ni en el chat.

## 4. Variables del repositorio
En GitHub → repositorio → **Settings → Secrets and variables → Actions → Variables**, crea:
- `VITE_SUPABASE_URL` = Project URL
- `VITE_SUPABASE_ANON_KEY` = anon public key

La anon key es pública por diseño (va dentro de la app); lo que protege los datos son las políticas RLS del paso 1. Luego vuelve a correr el flujo "Publicar en GitHub Pages" (pestaña Actions → Run workflow).

## 5. Desarrollo local (opcional)
Crea `.env.local` (ignorado por git) con las mismas dos variables y corre `npm run dev`.

## Cómo se sincroniza
- Al iniciar sesión, lo que solo existe en la nube se descarga, lo local se sube y **nunca se sobrescribe lo local**.
- Cada guardado posterior se replica en la nube; si falla, aparece un aviso.
- Lo que llega de la nube se valida igual que lo local antes de usarse.
- Limitación actual: si un alumno juega en dos dispositivos con avances distintos, gana el último que guarde.
