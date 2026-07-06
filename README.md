# David Boza Barbería — App de reservas

Web app para reservar citas de barbería/salón. Los **clientes agendan sin crear
cuenta** desde su teléfono; el **barbero/estilista** gestiona su agenda desde un
portal privado.

Parte de un **SaaS multitenant**: todos los salones comparten una base Supabase
(`isco-salones`) aislada por RLS. Este despliegue sirve UN salón, identificado por
`NEXT_PUBLIC_SALON_SLUG`. **Toda la config (servicios, precios, horario, nombre) se
lee en vivo de la base** con el RPC `get_salon_public` — cambiarla no requiere redeploy.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v3** (NO v4 — su binario nativo se bloquea en Windows con
  Application Control)
- **Supabase**: Postgres + Auth + Realtime + Edge Functions (base compartida)
- **@supabase/ssr** para la sesión del barbero — protección de rutas en `src/proxy.ts`
  (Next 16 renombró `middleware` → `proxy`)
- **date-fns / date-fns-tz** para la zona horaria (viene en la config del salón)
- **Resend** (opcional, por salón) para el correo de aviso

## Config del salón

- La app trae la config con `getSalonConfig()` (`src/lib/salon.ts`) → `get_salon_public`.
- **Servicios/precios/duración, categorías, horario, nombre, zona y tema** viven en
  la base (`salon_services`, `salon_categories`, `salon_hours`, `salons`), no en el
  código. `src/lib/booking.ts` solo tiene lógica pura que opera sobre esa config.
- **Rejilla:** cada 30 min. La disponibilidad respeta la `duration_min` del servicio
  y el `max_bookings_per_slot` del salón.
- **Datos del cliente al reservar:** nombre + teléfono (sin login).

## Seguridad y datos

- Aislamiento por RLS: cada barbero tiene `salon_id` en el JWT; solo ve/gestiona sus
  filas. El anónimo **no** lee tablas directo — usa los RPC `SECURITY DEFINER`
  `get_salon_public`, `get_day_load` y `book_appointment`.
- Login por **usuario/contraseña**: el usuario se mapea a `usuario@<slug>.local`
  (Supabase Auth usa correo por detrás, invisible al barbero).

## Correr localmente

```bash
npm install
npm run dev   # http://localhost:3000
```

`.env.local` (copiá `env.local.example`): la URL, la anon key y la VAPID pública ya
vienen puestas (base compartida, iguales para todos). Solo cambia
`NEXT_PUBLIC_SALON_SLUG`.

**Rutas:** `/` · `/reservar` · `/barbero/login` · `/barbero`.

## Notificaciones push (PWA) y correo

La app es instalable (**Agregar a pantalla de inicio**) y envía una **notificación
push del sistema** al barbero por cada reserva, aunque tenga la app cerrada. La Edge
Function global `notify-booking` manda push (VAPID global) **y** correo (Resend, si el
salón lo tiene configurado en `salon_secrets`), de forma independiente.

- **Manifest:** `src/app/manifest.ts` (`display: standalone`) + iconos en `public/`
  (generados con `node scripts/gen-icons.js public`).
- **Service worker:** `public/sw.js` (evento `push` + `notificationclick`).
- **Suscripción:** el barbero toca **"Activar notificaciones"** en `/barbero`
  (`src/lib/push.ts`); se guarda en `public.push_subscriptions` (RLS por barbero;
  el `salon_id` lo pone un trigger).

**iOS vs Android:** en Android el push anda incluso desde el navegador; en
**iPhone/iPad (iOS 16.4+)** el barbero debe instalar la app en la pantalla de inicio
y abrirla desde ese ícono antes de activar las notificaciones. Requiere **HTTPS**.
