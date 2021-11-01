import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LivrosController } from '../src/livros.controller';
import { LivrosService } from '../src/livros.service';
import { Livro } from '../src/livro.model';
import { CreateLivroDTO } from '../src/create-livro.dto';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

describe('Livros', () => {
  let moduleRef: TestingModule;
  let app: INestApplication;

  let savedLivro: Livro;

  beforeAll(async () => {

    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        SequelizeModule.forRoot({
          dialect: 'mysql',
          host: 'localhost',
          port: 3306,
          username: process.env.USUARIO_BANCO_DADOS,
          password: process.env.SENHA_BANCO_DADOS,
          database: 'livraria_testes',
          autoLoadModels: true,
          synchronize: true,
        }),
        SequelizeModule.forFeature([Livro]),
      ],
      controllers: [LivrosController],
      providers: [LivrosService],
    }).compile();

    // deleta todos os registros anteriores
    await Livro.destroy({
      truncate: true
    });

    app = moduleRef.createNestApplication();
    await app.init();

    const livroService = moduleRef.get<LivrosService>(LivrosService);

    let savedLivroDTO = new CreateLivroDTO();
    savedLivroDTO.codigo = 'LIV12';
    savedLivroDTO.nome = '.NET Core';
    savedLivroDTO.preco = 45.5;
    
    // salva livro na base para testes
    savedLivro = await livroService.criar(savedLivroDTO);
  });

  afterAll(async () => {
    moduleRef.close();
  });

  it('/GET livros', async () => {

    const resGet = await request(app.getHttpServer())
      .get('/livros')
      .expect(200);

    expect(resGet.body?.length).toBe(1);
  });

  it('/GET livros/:id', async () => {

    const resGet = await request(app.getHttpServer())
      .get(`/livros/${savedLivro.id}`)
      .expect(200)
    expect(resGet.body.id).toBe(savedLivro.id);
    expect(resGet.body.codigo).toBe(savedLivro.codigo);
    expect(Number(resGet.body.preco)).toBeCloseTo(savedLivro.preco, 2);
  });

  it('/POST livros', async () => {

    let livro: any = {};
    livro.codigo = "LIV02";
    livro.nome = "C#";
    livro.preco = 49.90;

    const resPost = await request(app.getHttpServer())
      .post('/livros')
      .send(livro)
      .expect(201)
    expect(resPost.body?.id).toBeTruthy();
  })

  it('/PUT livros/:id', async () => {

    let putLivroDTO: any = {};
    putLivroDTO.id = savedLivro.id;
    putLivroDTO.codigo = 'LIV13';
    putLivroDTO.nome = 'HTML';
    putLivroDTO.preco = 60.0;

    const resPost = await request(app.getHttpServer())
      .put(`/livros`)
      .send(putLivroDTO)
      .expect(200)

    expect(resPost.body?.[0]).toBe(1);
  })
});