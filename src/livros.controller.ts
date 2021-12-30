import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Livro } from './livro.model';
import { LivrosService } from './livros.service';

@Controller('livros')
export class LivrosController {
  constructor(private livrosService: LivrosService) {}

  @Get()
  async obterTodos(): Promise<Livro[]> {
    return this.livrosService.obterTodos();
  }

  @Get(':id')
  async obterUm(@Param() params): Promise<Livro> {
    return this.livrosService.obterUm(params.id);
  }

  @Post()
  async criar(@Body() livro: Livro) {
    return this.livrosService.criar(livro);
  }

  @Post(':id/imagem')
  @UseInterceptors(FileInterceptor(
    'file',
    {
      limits: {
        fileSize: 2000000
      },
      fileFilter: function fileFilter (_req, file, cb) {
        try {
          if (file.mimetype === 'image/png') {
            return cb(null, true);
          }

          if (file.mimetype === 'image/jpeg') {
            return cb(null, true);
          }

          cb(new Error('mimetype inválido'), false);
    
        } catch (err) {
          cb(err, false);
        }
      }
    }
  ))
  async imagem(@Param() params, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('campo "file" vazio');
    }
    if (
      params.id === '' || 
      params.id === 'undefined' || 
      params.id === undefined || 
      params.id === null
    ) {
      throw new Error('parametro "id" inválido');
    }

    return await this.livrosService.subirImagem(file, params.id);
  }

  @Put()
  async alterar(@Body() livro: Livro): Promise<[number, Livro[]]> {
    return this.livrosService.alterar(livro);
  }

  @Delete(':id')
  async apagar(@Param() params) {
    this.livrosService.apagar(params.id);
  }
}
