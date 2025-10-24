/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/JwtAuthGuard/jwt_auth.guard';
import { ProductsController } from '../controller/products.controller';
import { ProductsService } from '../service/products.service';
import { ProductsProvider } from '../provider/products.provider';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import * as process from 'process';


const uploadPath = path.join(process.cwd(), 'upload', 'photo');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: uploadPath,
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.tif', '.tiff', '.bmp'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedExtensions.includes(ext)) {
          cb(null, true);
        } else {
          cb(new Error('Invalid file type'), false);
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    JwtAuthGuard,
    {
      provide: JwtService,
      useValue: new JwtService({}),
    },
    ...ProductsProvider,
  ],
  exports: [...ProductsProvider, ProductsService],
})
export class ProductsModule {}
