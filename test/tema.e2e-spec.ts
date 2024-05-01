import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../src/app.module';

describe('Testes dos Módulos Usuário e Auth (e2e)', () => {
  
  let token: any;
  let descricao: any = "";
  let temaId: any;
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: "sqlite",
          database: "db_blogpessoal_test.db",
          entities: [__dirname + "./../src/**/entities/*.entity.ts"],
          synchronize: true,
          dropSchema: true
        }),
        AppModule
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('00 - Cadastrando usuario para testes', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios/cadastrar')
      .send({
        nome: 'Henrique',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: ' '
      });
    expect(201)
  })

  it('00 - Autenticando Usuario (Login) para testes', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios/logar')
      .send({
        usuario: 'root@root.com',
        senha: 'rootroot'
      });
    expect(200)

    token = resposta.body.token;
  })

  it('01 - Deve Cadastrar um Tema', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/temas')
      .set('Authorization', `${token}`)
      .send({
        descricao: 'descrição qualquer'
      });
    expect(201)

    descricao = resposta.body.descricao
    temaId = resposta.body.id

  })

  it('02 - Deve Listar Todos os Temas', async () => {
    return request(app.getHttpServer())
      .get('/temas')
      .set('Authorization', `${token}`)
      .send({})
      .expect(200)
  })

  it('03 - Deve Listar Temas por Decrição', async () => {
    return request(app.getHttpServer())
      .get(`/temas/descricao/${descricao}`)
      .set('Authorization', `${token}`)
      .send({
        descricao: 'descrição qualquer'
      })
      .expect(200)
  })

  it('04 - Deve Listar Temas por ID', async () => {
    return request(app.getHttpServer())
      .get(`/temas/${temaId}`)
      .set('Authorization', `${token}`)
      .send({})
      .expect(200)
  })

  it('05 - Deve Atualizar um Tema', async () => {
    return request(app.getHttpServer())
      .put('/temas')
      .set('Authorization', `${token}`)
      .send({
        id: 1,
        descricao: "tema 1 - atualizado"
      })
      .expect(200)
      .then(resposta => {
        expect("tema 1 - atualizado").toEqual(resposta.body.descricao)
      })
  })

  it('06 - Deve Apagar um Tema', async () => {
    return request(app.getHttpServer())
      .delete(`/temas/${temaId}`)
      .set('Authorization', `${token}`)
      .send({})
      .expect(204)
  })

});
