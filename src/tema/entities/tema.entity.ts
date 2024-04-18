import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { IsNotEmpty } from "class-validator";
import { Postagem } from "src/postagem/entities/postagem.entity";

@Entity({name: "tb_temas"})
export class Tema {

     @PrimaryGeneratedColumn()
     id: number;

     @IsNotEmpty()
     @Column({length: 255, nullable: false})
     descricao: string;

     @OneToMany(() => Postagem, (postagem) => postagem.tema)
     postagem: Postagem[]
     
}