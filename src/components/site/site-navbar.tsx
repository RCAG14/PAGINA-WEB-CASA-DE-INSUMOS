import { CartSheet } from "@/components/site/cart-sheet";
import { Navbar, type NavbarLink } from "@/components/site/navbar";
import { getSession } from "@/lib/auth/session";
import { getLogo } from "@/lib/data/landing";
import { getDictionary } from "@/lib/i18n/locale";
import { HOME_CONTAINER } from "@/lib/layout";
import { RUTA_CATALOGO, type SeccionSitio } from "@/lib/secciones";

/**
 * Navbar reutilizable del sitio público: `<SiteNavbar seccion="cajas" />`.
 * Busca por su cuenta el logo y la sesión, y arma enlaces y acciones según la
 * sección, así cada página no repite esa configuración.
 *
 * - portada / webdev: enlaces a sus secciones + cuenta (iniciar sesión).
 * - cajas (catálogo, ficha, carrito, checkout): carrito en vez de cuenta, y
 *   rutas completas porque se usa en páginas donde esas secciones no existen.
 *   Requiere el CartProvider del layout (site).
 */
export async function SiteNavbar({ seccion }: { seccion: SeccionSitio }) {
  const [logo, session, { dict }] = await Promise.all([getLogo(), getSession(), getDictionary()]);

  const links: Record<SeccionSitio, NavbarLink[]> = {
    portada: [
      { href: "#servicios", label: dict.header.navServices },
      { href: "#sobre-nosotros", label: dict.header.navAbout },
      { href: "#contacto", label: dict.header.navContact },
    ],
    webdev: [
      { href: "#paquetes", label: dict.webdev.pricing.eyebrow },
      { href: "#trabajos", label: dict.header.navWork },
      { href: "#contacto", label: dict.header.navContact },
    ],
    cajas: [
      { href: `${RUTA_CATALOGO}#catalogo`, label: dict.header.navCatalog },
      { href: `${RUTA_CATALOGO}#como-comprar`, label: dict.howToBuy.eyebrow },
      { href: "#contacto", label: dict.header.navContact },
    ],
  };

  const esCajas = seccion === "cajas";

  return (
    <Navbar
      logoUrl={logo?.url ?? null}
      links={links[seccion]}
      containerClassName={HOME_CONTAINER}
      // `undefined` oculta la cuenta; `null` muestra "Iniciar sesión".
      session={esCajas ? undefined : session ? { nombre: session.nombre, rol: session.rol } : null}
      actions={esCajas ? <CartSheet /> : undefined}
    />
  );
}
