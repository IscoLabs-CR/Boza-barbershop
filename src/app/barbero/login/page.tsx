import { getSalonConfig } from "@/lib/salon";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const config = await getSalonConfig();
  return (
    <>
      {/* Mismo fondo mesh que la landing y el wizard (overscan para el blur). */}
      <div className="mesh-bg fixed -inset-[25%] -z-10" aria-hidden />
      <LoginForm salonName={config.name} slug={config.slug} />
    </>
  );
}
