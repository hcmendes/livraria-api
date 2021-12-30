import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GCSImagemService } from './implementations/gsc-imagem.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
  ],
  providers: [GCSImagemService],
  exports: [GCSImagemService]
})
export class ImagensModule {}
