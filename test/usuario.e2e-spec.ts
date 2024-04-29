import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../src/app.module';

describe('Testes dos Módulos Usuário e Auth (e2e)', () => {
  
  let token: any;
  let usuarioId: any;
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

  it('01 - Deve Cadastrar Usuario', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios/cadastrar')
      .send({
        nome: 'Henrique',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: ' '
      });
    expect(201)

    usuarioId = resposta.body.id;
  })

  it('02 - Deve Autenticar Usuario (Login)', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios/logar')
      .send({
        usuario: 'root@root.com',
        senha: 'rootroot'
      });
    expect(200)

    token = resposta.body.token;
  })

  it('03 - Não Deve Duplicar o Usuario', async () => {
    return request(app.getHttpServer())
      .post('/usuarios/cadastrar')
      .send({
        nome: 'Henrique',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: ' '
      })
      .expect(400)
  })
  
  it('04 - Deve Listar Todos os Usuarios', async () => {
    return request(app.getHttpServer())
      .get('/usuarios/all')
      .set('Authorization', `${token}`)
      .send({})
      .expect(200)
  })

  it('05 - Deve Listar um Usuario por ID', async () => {
    return request(app.getHttpServer())
      .get(`/usuarios/${usuarioId}`)
      .set('Authorization', `${token}`)
      .send({})
      .expect(200)
  })

  it('06 - Deve Atualizar um Usuario', async () => {
    return request(app.getHttpServer())
      .put('/usuarios/atualizar')
      .send({
        id: usuarioId,
        nome: 'Henrique Dev',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: ' '
      })
      .expect(200)
      .then(resposta => {
        expect("Henrique Dev").toEqual(resposta.body.nome)
      })
  })

});
