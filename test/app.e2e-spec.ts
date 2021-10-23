import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Livro } from '../src/livro.model';
import { LivrosController } from '../src/livros.controller';
import { LivrosService } from '../src/livros.service';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';

describe('AppController (e2e)', () => {
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
        AppModule,
      ],
      controllers: [AppController, LivrosController],
      providers: [AppService, LivrosService],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    moduleRef.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
