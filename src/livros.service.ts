import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Livro } from './livro.model';
import { CreateLivroDTO } from './create-livro.dto';
import { GCSImagemService } from './imagens/implementations/gsc-imagem.service';
import { IRetornoSubirImagem } from './imagens/dto/retorno-subir-imagem';

@Injectable()
export class LivrosService {

  constructor(
    @InjectModel(Livro)
    private livroModel: typeof Livro,

    private imagensService: GCSImagemService
  ) {}

  async subirImagem(imagem: Express.Multer.File, id: number) {
    const livro = await this.obterUm(id);
    if (!livro) throw new Error(`livro não encontrado. ${id}`);
    const resultado: IRetornoSubirImagem = await this.imagensService.subirImagem(
      imagem.mimetype, 
      id.toString(),
      imagem.buffer
    );
    if (!resultado.publicUrl) throw new Error(`publicUrl não foi gerada. ${imagem}`);
    livro.set('imagem', resultado.publicUrl);
    return await livro.save();
  }

  async obterTodos(): Promise<Livro[]> {
    return this.livroModel.findAll();
  }

  async obterUm(id: number): Promise<Livro> {
    return this.livroModel.findByPk(id);
  }

  async criar(livro: CreateLivroDTO): Promise<Livro> {
    return this.livroModel.create(livro);
  }

  async alterar(livro: Livro): Promise<[number, Livro[]]> {
    return this.livroModel.update(livro, {
      where: {
        id: livro.id
      },
    });
  }

  async apagar(id: number) {
    const livro: Livro = await this.obterUm(id);
    livro.destroy();
  }
}
