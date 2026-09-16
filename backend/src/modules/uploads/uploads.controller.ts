import {
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Role } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadsService } from './uploads.service';

@Controller('uploads')
@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadSingle(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.formatFileResponse(file);
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    return this.uploadsService.formatFilesResponse(files);
  }

  @Delete(':filename')
  deleteFile(@Param('filename') filename: string) {
    return this.uploadsService.deleteFile(filename);
  }
}
