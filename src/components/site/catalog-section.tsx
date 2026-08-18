import { CatalogBrowser } from "@/components/site/catalog-browser";
import { getCajas } from "@/lib/data/cajas";
import { getClasificaciones } from "@/lib/data/clasificaciones";

export async function CatalogSection() {
  const [boxes, classifications] = await Promise.all([getCajas(), getClasificaciones()]);
  return <CatalogBrowser boxes={boxes} classifications={classifications} />;
}
