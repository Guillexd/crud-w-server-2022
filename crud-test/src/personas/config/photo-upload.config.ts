import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';

const IMAGE_MIMETYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const UPLOAD_DIR = join(process.cwd(), 'uploads', 'personas');
const FOTO_URL_PREFIX = '/uploads/personas';

if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

export function buildFotoUrl(filename: string): string {
  return `${FOTO_URL_PREFIX}/${filename}`;
}

function imageFileFilter(
  _req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
): void {
  const extension = extname(file.originalname).toLowerCase();
  const isValidImage =
    IMAGE_MIMETYPES.includes(file.mimetype) &&
    IMAGE_EXTENSIONS.includes(extension);

  if (!isValidImage) {
    callback(
      new BadRequestException('Solo se permiten imagenes JPG, PNG, GIF o WEBP'),
      false,
    );
    return;
  }

  callback(null, true);
}

export const fotoUploadOptions: MulterOptions = {
  storage: diskStorage({
    destination: UPLOAD_DIR,
    filename: (_req, file, callback) => {
      const safeExtension = extname(file.originalname).toLowerCase();
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      callback(null, `persona-${uniqueSuffix}${safeExtension}`);
    },
  }),
  fileFilter: imageFileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
};
