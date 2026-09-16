import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

export interface UploadedFileResponse {
  url: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
}

@Injectable()
export class UploadsService {
  private readonly uploadsDir = join(process.cwd(), 'uploads');

  formatFileResponse(file: Express.Multer.File): UploadedFileResponse {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ningún archivo.');
    }

    return {
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    };
  }

  formatFilesResponse(files: Express.Multer.File[]): UploadedFileResponse[] {
    if (!files || files.length === 0) {
      throw new BadRequestException('No se han proporcionado archivos.');
    }

    return files.map((file) => this.formatFileResponse(file));
  }

  deleteFile(filename: string): { message: string } {
    // Evita vulnerabilidades de path traversal
    const safeFilename = filename.replace(/^(\.\.[/\\])+/, '');
    const filePath = join(this.uploadsDir, safeFilename);

    if (!existsSync(filePath)) {
      throw new NotFoundException('El archivo no existe.');
    }

    try {
      unlinkSync(filePath);
      return { message: 'Archivo eliminado correctamente.' };
    } catch {
      throw new BadRequestException('No fue posible eliminar el archivo.');
    }
  }
}
