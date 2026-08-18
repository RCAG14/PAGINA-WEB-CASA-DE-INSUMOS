"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  ArrowDown,
  ArrowUp,
  BadgeCheck,
  Clapperboard,
  GalleryHorizontal,
  Image as ImageIcon,
  Pencil,
  Plus,
  Tag,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import {
  actualizarContenidoLandingAction,
  crearContenidoLandingAction,
  eliminarContenidoLandingAction,
  reordenarContenidoLandingAction,
} from "@/app/admin/configuracion/landing/actions";
import {
  LandingMediaFormDialog,
  type ContenidoLandingFormValues,
} from "@/components/admin/landing-media-form-dialog";
import { Button } from "@/components/ui/button";
import type { ContenidoLanding } from "@/generated/prisma/client";
import type { FormatoMedia, TipoContenidoLanding } from "@/lib/data/landing";
import type { Box, CategoryMeta } from "@/lib/types";

interface SectionConfig {
  tipo: TipoContenidoLanding;
  titulo: string;
  descripcion: string;
  formato: FormatoMedia;
  folder: string;
  withCta: boolean;
  icon: LucideIcon;
  allowMultiple: boolean;
}

const SECTIONS: SectionConfig[] = [
  {
    tipo: "logo",
    titulo: "Logo de la empresa",
    descripcion:
      'Reemplaza el ícono cuadrado junto a "Casa de Insumos" en el header, y aparece también en el pie de página, en la ficha de producto, el carrito y el checkout.',
    formato: "imagen",
    folder: "casa-de-insumos/landing/logo",
    withCta: false,
    icon: BadgeCheck,
    allowMultiple: false,
  },
  {
    tipo: "hero_video",
    titulo: "Video de fondo del Hero",
    descripcion:
      "Video en bucle de fondo del encabezado principal. Si hay uno activo, tiene prioridad sobre el carrusel de imágenes.",
    formato: "video",
    folder: "casa-de-insumos/landing/hero",
    withCta: false,
    icon: Clapperboard,
    allowMultiple: false,
  },
  {
    tipo: "hero_imagen",
    titulo: "Carrusel de imágenes del Hero",
    descripcion:
      "Fondo del encabezado cuando no hay video activo. Rotan en el orden mostrado abajo.",
    formato: "imagen",
    folder: "casa-de-insumos/landing/hero",
    withCta: false,
    icon: GalleryHorizontal,
    allowMultiple: true,
  },
  {
    tipo: "about_imagen",
    titulo: 'Imagen de "Sobre nosotros"',
    descripcion: "Foto que acompaña el bloque de propuesta de valor de la página principal.",
    formato: "imagen",
    folder: "casa-de-insumos/landing/about",
    withCta: false,
    icon: ImageIcon,
    allowMultiple: false,
  },
  {
    tipo: "banner_promo",
    titulo: "Banners de promociones",
    descripcion:
      "Tarjetas promocionales con botón de llamada a la acción, mostradas antes del catálogo.",
    formato: "imagen",
    folder: "casa-de-insumos/landing/banners",
    withCta: true,
    icon: Tag,
    allowMultiple: true,
  },
];

function toFormValues(item: ContenidoLanding): ContenidoLandingFormValues {
  return {
    url: item.url,
    storagePath: item.storage_path,
    titulo: item.titulo ?? "",
    subtitulo: item.subtitulo ?? "",
    enlaceCta: item.enlace_cta ?? "",
    textoCta: item.texto_cta ?? "",
    activo: item.activo,
  };
}

export function LandingMediaManager({
  items,
  boxes,
  classifications,
}: {
  items: ContenidoLanding[];
  boxes: Box[];
  classifications: CategoryMeta[];
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  function refrescar() {
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-10">
      {SECTIONS.map((section) => {
        const sectionItems = items
          .filter((i) => i.tipo === section.tipo)
          .sort((a, b) => a.orden - b.orden);
        const canAdd = section.allowMultiple || sectionItems.length === 0;

        return (
          <div key={section.tipo} className="flex flex-col gap-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center border border-primary/30 bg-primary/5 text-primary">
                  <section.icon className="size-4" strokeWidth={1.5} />
                </span>
                <div>
                  <p className="font-mono-technical text-[11px] uppercase tracking-wider text-foreground">
                    {section.titulo}
                  </p>
                  <p className="max-w-xl text-xs text-muted-foreground">{section.descripcion}</p>
                </div>
              </div>

              {canAdd && (
                <LandingMediaFormDialog
                  trigger={<Button size="sm" />}
                  triggerContent={
                    <>
                      <Plus className="size-4" /> Añadir
                    </>
                  }
                  dialogTitle={`Nuevo — ${section.titulo}`}
                  dialogDescription="El archivo se sube directamente a Supabase Storage y queda listo para publicarse."
                  formato={section.formato}
                  folder={section.folder}
                  withCta={section.withCta}
                  boxes={section.withCta ? boxes : undefined}
                  classifications={section.withCta ? classifications : undefined}
                  onSubmit={(values) => {
                    startTransition(async () => {
                      await crearContenidoLandingAction({
                        tipo: section.tipo,
                        formato: section.formato,
                        url: values.url,
                        storagePath: values.storagePath,
                        titulo: values.titulo || null,
                        subtitulo: values.subtitulo || null,
                        enlaceCta: values.enlaceCta || null,
                        textoCta: values.textoCta || null,
                        activo: values.activo,
                      });
                      refrescar();
                    });
                  }}
                />
              )}
            </div>

            {sectionItems.length === 0 ? (
              <p className="border border-dashed border-border bg-card/60 px-4 py-6 text-center text-xs text-muted-foreground">
                Nada subido todavía.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {sectionItems.map((item, i) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-2 border border-border bg-card p-2.5"
                  >
                    <div className="relative aspect-video w-full overflow-hidden border border-border bg-muted">
                      {item.formato === "video" ? (
                        <video
                          src={item.url}
                          className="h-full w-full object-cover"
                          muted
                          loop
                          autoPlay
                          playsInline
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.url}
                          alt={item.titulo ?? ""}
                          className="h-full w-full object-cover"
                        />
                      )}
                      <span
                        className={
                          item.activo
                            ? "absolute right-1.5 top-1.5 border border-primary bg-primary px-1.5 py-0.5 font-mono-technical text-[9px] uppercase tracking-wider text-primary-foreground"
                            : "absolute right-1.5 top-1.5 border border-border bg-background/90 px-1.5 py-0.5 font-mono-technical text-[9px] uppercase tracking-wider text-muted-foreground"
                        }
                      >
                        {item.activo ? "Visible" : "Oculto"}
                      </span>
                    </div>

                    {item.titulo && <p className="truncate text-xs font-medium">{item.titulo}</p>}

                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1">
                        {section.allowMultiple && (
                          <>
                            <Button
                              variant="outline"
                              size="icon-xs"
                              aria-label="Mover arriba"
                              disabled={i === 0}
                              onClick={() =>
                                startTransition(async () => {
                                  const prev = sectionItems[i - 1];
                                  await reordenarContenidoLandingAction(
                                    item.id,
                                    item.orden,
                                    prev.id,
                                    prev.orden
                                  );
                                  refrescar();
                                })
                              }
                            >
                              <ArrowUp className="size-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon-xs"
                              aria-label="Mover abajo"
                              disabled={i === sectionItems.length - 1}
                              onClick={() =>
                                startTransition(async () => {
                                  const next = sectionItems[i + 1];
                                  await reordenarContenidoLandingAction(
                                    item.id,
                                    item.orden,
                                    next.id,
                                    next.orden
                                  );
                                  refrescar();
                                })
                              }
                            >
                              <ArrowDown className="size-3" />
                            </Button>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <LandingMediaFormDialog
                          trigger={<Button variant="outline" size="icon-xs" />}
                          triggerContent={<Pencil className="size-3" />}
                          dialogTitle={`Editar — ${section.titulo}`}
                          dialogDescription="El archivo se sube directamente a Supabase Storage y queda listo para publicarse."
                          formato={section.formato}
                          folder={section.folder}
                          withCta={section.withCta}
                          boxes={section.withCta ? boxes : undefined}
                          classifications={section.withCta ? classifications : undefined}
                          item={toFormValues(item)}
                          onSubmit={(values) => {
                            startTransition(async () => {
                              await actualizarContenidoLandingAction(item.id, {
                                tipo: section.tipo,
                                formato: section.formato,
                                url: values.url,
                                storagePath: values.storagePath,
                                titulo: values.titulo || null,
                                subtitulo: values.subtitulo || null,
                                enlaceCta: values.enlaceCta || null,
                                textoCta: values.textoCta || null,
                                activo: values.activo,
                              });
                              refrescar();
                            });
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          aria-label="Eliminar"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() =>
                            startTransition(async () => {
                              await eliminarContenidoLandingAction(item.id);
                              refrescar();
                            })
                          }
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
