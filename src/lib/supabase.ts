import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// La validación/configuración es perezosa para que el módulo se pueda importar
// en entornos donde aún no se configuraron las credenciales sin reventar hasta
// que efectivamente se suba o borre un archivo.
let client: SupabaseClient | null = null;

function getServiceClient(): SupabaseClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Faltan variables de entorno de Supabase. Define NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en tu .env."
    );
  }

  client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

function getBucket(): string {
  return process.env.SUPABASE_STORAGE_BUCKET ?? "casa-de-insumos";
}

export interface StorageUploadResult {
  url: string;
  path: string;
}

export async function uploadToSupabaseStorage(
  buffer: Buffer,
  options: { folder: string; fileName: string; contentType: string }
): Promise<StorageUploadResult> {
  const supabase = getServiceClient();
  const bucket = getBucket();
  const safeName = options.fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `${options.folder}/${crypto.randomUUID()}-${safeName}`;

  const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
    contentType: options.contentType,
    upsert: false,
  });
  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);

  return { url: publicUrl, path };
}

export async function deleteFromSupabaseStorage(path: string): Promise<void> {
  const supabase = getServiceClient();
  const { error } = await supabase.storage.from(getBucket()).remove([path]);
  if (error) throw error;
}
