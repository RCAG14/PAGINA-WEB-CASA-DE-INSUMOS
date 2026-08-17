export type BoxCategorySlug = string;

export type ClassificationIcon =
  | "electronica"
  | "joyeria"
  | "hogar"
  | "moda"
  | "herramientas"
  | "belleza"
  | "juguetes"
  | "mixto";

export interface CategoryMeta {
  id: string;
  slug: BoxCategorySlug;
  label: string;
  descripcion: string;
  icon: ClassificationIcon;
}

export interface BoxItemSpec {
  productoId: string;
  nombre: string;
  cantidad: number;
  condicion: string;
  precioReferencial: number;
  precioVentaSugerido: number;
}

export interface BoxSpecs {
  skuCaja: string;
  manifiesto: string;
  origen: string;
  centroRetorno: string;
  certificacionAduanera: string;
  gradoLiquidacion: string;
  pesoBruto: string;
  dimensiones: string;
}

interface BaseBox {
  id: string;
  slug: string;
  nombre: string;
  clasificacion: CategoryMeta;
  /** Foto real del lote en Cloudinary. Si es null, la UI usa el ícono de clasificación. */
  imagenUrl: string | null;
  precio: number;
  /** Suma real de precio_venta_sugerido * cantidad del detalle de la caja. */
  valorRetailEstimado: number;
  stock: number;
  descripcionCorta: string;
  descripcionTecnica: string;
  specs: BoxSpecs;
  destacada: boolean;
  rating: number;
  numResenas: number;
}

export interface StructuredBox extends BaseBox {
  tipo: "listada";
  contenido: BoxItemSpec[];
}

export interface SurpriseBox extends BaseBox {
  tipo: "sorpresa";
  /** Rango de contenido posible — el desglose exacto no se expone públicamente. */
  cantidadEstimadaMin: number;
  cantidadEstimadaMax: number;
  valorEstimadoMin: number;
  valorEstimadoMax: number;
}

export type Box = StructuredBox | SurpriseBox;

export interface CartLine {
  boxId: string;
  slug: string;
  nombre: string;
  tipo: Box["tipo"];
  clasificacionLabel: string;
  clasificacionIcono: ClassificationIcon;
  skuCaja: string;
  precio: number;
  cantidad: number;
  stock: number;
}

export type OrderStatus =
  | "Pendiente"
  | "En Preparación"
  | "Enviado"
  | "Entregado"
  | "Cancelado";

export interface AdminOrder {
  id: string;
  codigoPedido: string;
  cliente: string;
  fecha: string;
  total: number;
  items: number;
  estado: OrderStatus;
}
