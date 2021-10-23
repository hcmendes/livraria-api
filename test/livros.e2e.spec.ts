import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LivrosController } from '../src/livros.controller';
import { LivrosService } from '../src/livros.service';
import { Livro } from '../src/livro.model';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

describe('Livros', () => {
  let moduleRef: TestingModule;
  let app: INestApplication;

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
  });

  afterAll(async () => {
    moduleRef.close();
  });

  it('/GET livros', async () => {

    return request(app.getHttpServer())
      .get('/livros')
      .expect(200)
      .expect([]);
  });

  it('/GET livros/:id', async () => {

    let livro: any = {};
    livro.codigo = "LIV02";
    livro.nome = "C#";
    livro.preco = 49.90;
    console.log({ livro });

    const resPost = await request(app.getHttpServer())
      .post('/livros')
      .send(livro)
      .expect(201)
    expect(resPost.body).toBeTruthy();

    livro.id = resPost.body.id;
    expect(livro.id).toBeTruthy();

    const resGet = await request(app.getHttpServer())
      .get(`/livros/${livro.id}`)
      .expect(200)
    expect(resGet.body.id).toBe(livro.id);
  });

});