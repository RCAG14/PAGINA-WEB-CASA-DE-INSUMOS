import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ConfiguracionSidebar } from "@/components/admin/configuracion-sidebar";
import { verifyJefe } from "@/lib/auth/dal";
import { getLogo } from "@/lib/data/landing";

export default async function ConfiguracionModuleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defensa en profundidad: proxy.ts ya bloquea al Socio por ruta, esto lo
  // repite a nivel de datos/render por si algún día cambia el matcher.
  await verifyJefe();
  const logo = await getLogo();

  return (
    <SidebarProvider>
      <ConfiguracionSidebar logoUrl={logo?.url ?? null} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
