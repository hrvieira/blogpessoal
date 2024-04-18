import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { Tema } from "src/tema/entities/tema.entity";

@Entity({name: "tb_postagens"})
export class Postagem {

     @PrimaryGeneratedColumn()
     id: number;

     @Transform(({ value }: TransformFnParams) => value?.trim()) 
     @IsNotEmpty()
     @Column({length: 100, nullable: false})
     titulo: string;

     @Transform(({ value }: TransformFnParams) => value?.trim()) 
     @IsNotEmpty()
     @Column({length: 1000, nullable: false})
     texto: string;

     @UpdateDateColumn()
     data: Date;

     @ManyToOne(() => Tema, (tema) => tema.postagem, {
          onDelete: "CASCADE"
     })
     tema: Tema;

}

