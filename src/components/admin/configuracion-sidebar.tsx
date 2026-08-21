"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ExternalLink,
  GalleryHorizontalEnd,
  LayoutGrid,
  Share2,
  Square,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const NAV_ITEMS = [
  {
    href: "/admin/configuracion/landing",
    label: "Imágenes Promocionales / Landing Page",
    icon: GalleryHorizontalEnd,
  },
  { href: "/admin/configuracion/contacto", label: "Redes y Contacto", icon: Share2 },
  { href: "/admin/configuracion/socios", label: "Socios", icon: Users },
];

export function ConfiguracionSidebar({ logoUrl }: { logoUrl?: string | null }) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 py-1.5">
          <span
            className={cn(
              "relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg text-sidebar-primary shadow-glow-primary",
              logoUrl ? "bg-sidebar-foreground/95" : "bg-sidebar-primary/15"
            )}
          >
            {logoUrl ? (
              <Image src={logoUrl} alt="Casa Insumos" fill sizes="32px" className="object-contain p-0.5" />
            ) : (
              <Square className="size-4" strokeWidth={2.5} />
            )}
          </span>
          <div className="flex flex-col leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-heading text-xs font-bold uppercase tracking-wide text-sidebar-foreground">
              Casa Insumos
            </span>
            <span className="font-mono-technical text-[9px] uppercase tracking-wider text-sidebar-foreground/50">
              Configuración Global
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-mono-technical text-[10px] uppercase tracking-wider">
            Sistema
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="/admin" />} tooltip="Portal de módulos">
              <LayoutGrid />
              <span>Portal de módulos</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="/" />} tooltip="Volver a la tienda">
              <ExternalLink />
              <span>Volver a la tienda</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
