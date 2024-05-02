import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../src/app.module';

describe('Testes dos Módulos Usuário e Auth (e2e)', () => {
  
  let token: any;
  let titulo: any;
  let postagemId: any;
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

  it('00 - Deve Cadastrar um Tema para testes', async () => {
     const resposta = await request(app.getHttpServer())
       .post('/temas')
       .set('Authorization', `${token}`)
       .send({
         descricao: 'descrição qualquer'
       });
     expect(201)
 
   })

  it('01 - Deve Cadastrar Postagem', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/postagens')
      .set('Authorization', `${token}`)
      .send({
          titulo: "Turma JS04",
          texto: "Postagem Turma JS04 - teste tema",
          tema: {
               "id": 1
          },
          usuario: {
               "id": 1
          }
     });
    expect(201)

    titulo = resposta.body.titulo
    postagemId = resposta.body.id

  })

  it('02 - Deve Listar Todos as Postagens', async () => {
    return request(app.getHttpServer())
      .get('/postagens')
      .set('Authorization', `${token}`)
      .send({})
      .expect(200)
  })

  it('03 - Deve Listar Postagens por Titulo', async () => {
    return request(app.getHttpServer())
      .get(`/postagens/titulo/${titulo}`)
      .set('Authorization', `${token}`)
      .send({})
      .expect(200)
  })

  it('04 - Deve Listar Postagem por ID', async () => {
    return request(app.getHttpServer())
      .get(`/postagens/${postagemId}`)
      .set('Authorization', `${token}`)
      .send({})
      .expect(200)
  })

  it('05 - Deve Atualizar uma Postagem', async () => {
    return request(app.getHttpServer())
      .put('/postagens')
      .set('Authorization', `${token}`)
      .send({
          id: 1,
          titulo: "Turma JS04 - Atualizada",
          texto: "Postagem Turma JS04 - Atualizada",
          tema: {
               "id": 1
          },
          usuario: {
               "id": 1
          }
      })
      .expect(200)
      .then(resposta => {
        expect("Turma JS04 - Atualizada").toEqual(resposta.body.titulo)
      })
  })

  it('06 - Deve Apagar uma Postagem', async () => {
    return request(app.getHttpServer())
      .delete(`/temas/${postagemId}`)
      .set('Authorization', `${token}`)
      .send({})
      .expect(204)
  })

});
