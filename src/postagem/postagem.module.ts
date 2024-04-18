import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostagemController } from "./controllers/postagem.controller";
import { Postagem } from "./entities/postagem.entity";
import { PostagemService } from "./services/postagem.service";
import { TemaModule } from "src/tema/entities/tema.module";
import { TemaService } from "src/tema/services/tema.services";

@Module({
     imports: [TypeOrmModule.forFeature([Postagem]), TemaModule],
     providers: [PostagemService, TemaService],
     controllers: [PostagemController],
     exports: [TypeOrmModule]
})
export class PostagemModule {}