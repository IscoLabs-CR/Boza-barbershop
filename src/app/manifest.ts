import type { MetadataRoute } from "next";

// Web App Manifest — hace la app instalable en la pantalla de inicio (iOS 16.4+
// y Android). `display: standalone` la abre sin barra del navegador, requisito
// para que iOS permita notificaciones push. Los iconos viven en /public.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Boza Barbershop — Reservas",
    short_name: "Boza Barbershop",
    description:
      "Boza Barbershop: reservá tu cita en segundos, o si sos el barbero, llevá tu agenda.",
    // Abre en la portada (no en /barbero): así el cliente ve "Reservar cita" y el
    // barbero entra a su agenda con "Soy Barbero", sin caer en el login.
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#26262d",
    lang: "es",
    categories: ["business", "productivity", "lifestyle"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
