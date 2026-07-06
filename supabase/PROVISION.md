# Provisión del salón (base multitenant compartida)

Esta app **NO tiene su propia base de datos**. Todos los salones/barberías viven
en un único proyecto Supabase compartido — **`isco-salones`**
(ref `icwbzaronhvyicvfszvr`) — aislados por RLS con el `salon_id` que viaja en el
JWT de cada barbero. El esquema (tablas, RLS, RPCs, triggers, Edge Function,
VAPID global) **ya está desplegado ahí**; no se aplica nada por cliente.

Dar de alta un cliente nuevo = **una sola llamada** a `provision_salon(...)` con
`execute_sql` (service_role). Crea el salón + categorías + servicios + horario +
usuario de login (con `salon_id` en `app_metadata`) + fila `barbers`.

```sql
select public.provision_salon(
  p_slug        => 'jordy-barber',
  p_name        => 'Jordy Barber',
  p_barber_name => 'Jordy Meza',
  p_login_email => 'jordy.barber@jordy-barber.local',  -- <usuario>@<slug>.local
  p_password    => 'la-contraseña',
  p_categories  => '[{"slug":"cortes","label":"Cortes","display_order":0}]'::jsonb,
  p_services    => '[
    {"slug":"sencillo","label":"Corte sencillo","category":"cortes","price_crc":4000,"duration_min":60,"display_order":0},
    {"slug":"sombreado","label":"Corte sombreado","category":"cortes","price_crc":5000,"duration_min":60,"display_order":1},
    {"slug":"lavado_cejas","label":"Corte + Lavado + Cejas","category":"cortes","price_crc":5500,"duration_min":60,"display_order":2},
    {"slug":"barba","label":"Corte + Barba","category":"cortes","price_crc":6000,"duration_min":60,"display_order":3},
    {"slug":"full","label":"Full service","category":"cortes","price_crc":7500,"duration_min":90,"display_order":4}
  ]'::jsonb,
  -- Horario por día (dow 0=Dom..6=Sáb); un día SIN fila = cerrado. open/close en minutos.
  p_hours       => '[
    {"dow":1,"open_min":480,"close_min":1140},{"dow":2,"open_min":480,"close_min":1140},
    {"dow":3,"open_min":480,"close_min":1140},{"dow":4,"open_min":480,"close_min":1140},
    {"dow":5,"open_min":480,"close_min":1140},{"dow":6,"open_min":480,"close_min":1140}
  ]'::jsonb,
  p_timezone              => 'America/Costa_Rica',
  p_theme                 => '{"tagline":"Barbería"}'::jsonb,
  p_max_bookings_per_slot => 1,          -- barbería: 1 por espacio; salón: N
  p_notify_email          => 'correo@delcliente.com',
  p_resend_api_key         => null,       -- opcional (correo por Resend)
  p_notify_from            => null
);
```

Devuelve `{salon_id, barber_id, slug}`. Después solo hace falta desplegar la app
con `NEXT_PUBLIC_SALON_SLUG=<slug>` (ver `env.local.example`). La duración por
servicio (`duration_min`, múltiplos de 30) + `max_bookings_per_slot` cubren tanto
barberías (cortes de 60/90 min, 1 por espacio) como salones (30 min, N por espacio).

**Notas:**
- El precio `price_crc` en `null` se muestra como "Por cotizar".
- Las categorías son por salón; podés tener una sola (`cortes`) o varias.
- Para editar precios/horario/servicios después: `update`/`insert` en
  `salon_services` / `salon_hours` de ese `salon_id`. **No requiere redeploy** —
  la app lee la config en vivo con `get_salon_public`.
- VAPID y la Edge Function `notify-booking` son **globales** (ya desplegadas). No
  se generan ni despliegan por cliente.
