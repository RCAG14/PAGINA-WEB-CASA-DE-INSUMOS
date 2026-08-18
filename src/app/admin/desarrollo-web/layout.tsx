import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DesarrolloWebSidebar } from "@/components/admin/desarrollo-web-sidebar";
import { verifyJefe } from "@/lib/auth/dal";

export default async function DesarrolloWebModuleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defensa en profundidad: proxy.ts ya bloquea al Socio por ruta, esto lo
  // repite a nivel de datos/render por si algún día cambia el matcher.
  await verifyJefe();

  return (
    <SidebarProvider>
      <DesarrolloWebSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
