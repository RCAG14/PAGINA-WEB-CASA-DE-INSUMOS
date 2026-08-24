import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DesarrolloWebSidebar } from "@/components/admin/desarrollo-web-sidebar";
import { verifyJefe, verifyModuloActivo } from "@/lib/auth/dal";
import { getLogo } from "@/lib/data/landing";

export default async function DesarrolloWebModuleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defensa en profundidad: proxy.ts ya bloquea al Socio por ruta, esto lo
  // repite a nivel de datos/render por si algún día cambia el matcher.
  await verifyJefe();
  await verifyModuloActivo("desarrollo-web");
  const logo = await getLogo();

  return (
    <SidebarProvider>
      <DesarrolloWebSidebar logoUrl={logo?.url ?? null} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
