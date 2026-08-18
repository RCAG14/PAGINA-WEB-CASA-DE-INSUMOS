import { Check } from "lucide-react";
import { getNumeroWhatsappPrincipal } from "@/lib/data/contacto";
import { buildWhatsAppLink, cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { ScrollReveal } from "@/components/site/scroll-reveal";

// Precios y alcance de referencia — ajustar aquí antes de publicar en producción.
// El plan "destacado" se resalta visualmente como la opción recomendada.
const PAQUETES = [
  {
    nombre: "Básico",
    precio: 1500,
    tagline: "Presencia digital simple y profesional.",
    features: [
      "Sitio web de hasta 5 páginas",
      "Diseño responsive (mobile y desktop)",
      "Formulario de contacto",
      "Optimización SEO básica",
      "1 mes de soporte post-entrega",
    ],
    destacado: false,
  },
  {
    nombre: "Estándar",
    precio: 3500,
    tagline: "Sitio o sistema a medida con panel propio.",
    features: [
      "Todo lo del plan Básico",
      "Hasta 10 páginas o módulos",
      "Panel de administración de contenido",
      "Integración con WhatsApp",
      "Analítica de visitas",
      "3 meses de soporte post-entrega",
    ],
    destacado: true,
  },
  {
    nombre: "Premium",
    precio: 7000,
    tagline: "Sistema web completo, a tu medida.",
    features: [
      "Todo lo del plan Estándar",
      "Dashboard con roles de usuario",
      "Integraciones a medida (pagos, chatbot, reservas)",
      "Base de datos y backend a medida",
      "Soporte prioritario 6 meses",
    ],
    destacado: false,
  },
] as const;

export async function WebDevPricing() {
  const whatsappNumero = await getNumeroWhatsappPrincipal();

  return (
    <section
      id="paquetes"
      className="flex min-h-screen items-center border-b border-border bg-background"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <ScrollReveal className="mb-8 flex flex-col items-center gap-2 text-center">
          <span className="font-mono-technical text-xs uppercase tracking-wider text-accent">
            Paquetes
          </span>
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
            Elegí el alcance que necesitás
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Precios referenciales — la cotización final se ajusta según el alcance exacto de tu
            proyecto.
          </p>
        </ScrollReveal>

        <div className="grid gap-4 lg:grid-cols-3">
          {PAQUETES.map((paquete, i) => {
            const mensaje = `Hola, quiero cotizar el paquete ${paquete.nombre} de desarrollo web.`;
            return (
              <ScrollReveal key={paquete.nombre} delayMs={i * 100}>
                <div
                  className={cn(
                    "flex h-full flex-col gap-4 border bg-card p-6",
                    paquete.destacado ? "border-2 border-primary" : "border-border"
                  )}
                >
                  {paquete.destacado && (
                    <span className="w-fit bg-primary px-2 py-0.5 font-mono-technical text-[10px] uppercase tracking-wider text-primary-foreground">
                      Recomendado
                    </span>
                  )}
                  <div>
                    <h3 className="font-heading text-lg font-semibold">{paquete.nombre}</h3>
                    <p className="text-xs text-muted-foreground">{paquete.tagline}</p>
                  </div>

                  <p className="font-heading text-3xl font-bold text-primary">
                    {formatPrice(paquete.precio)}
                  </p>

                  <ul className="flex flex-1 flex-col gap-2">
                    {paquete.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.5} />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {whatsappNumero ? (
                    <a
                      href={buildWhatsAppLink(whatsappNumero, mensaje)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "flex items-center justify-center px-4 py-2 text-center font-mono-technical text-xs uppercase tracking-wider transition-colors",
                        paquete.destacado
                          ? "bg-primary text-primary-foreground hover:bg-primary/85"
                          : "border border-border text-foreground hover:border-primary hover:text-primary"
                      )}
                    >
                      Cotizar por WhatsApp
                    </a>
                  ) : (
                    <span className="border border-dashed border-accent bg-accent/10 px-4 py-2 text-center font-mono-technical text-[11px] uppercase tracking-wider text-primary">
                      Configurá un número de contacto para cotizar
                    </span>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
