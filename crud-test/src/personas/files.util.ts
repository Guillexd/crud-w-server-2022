import { unlink } from 'fs/promises';
import { basename, join } from 'path';

const UPLOAD_DIR = join(process.cwd(), 'uploads', 'personas');

export async function deleteFotoFile(fotoUrl?: string | null): Promise<void> {
  if (!fotoUrl) {
    return;
  }

  const filePath = join(UPLOAD_DIR, basename(fotoUrl));
  try {
    await unlink(filePath);
  } catch {
    // el archivo no existe o no se pudo borrar; se ignora
  }
}
