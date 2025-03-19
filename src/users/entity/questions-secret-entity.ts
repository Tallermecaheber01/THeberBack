import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('questionsecret')
export class QuestionSecretEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    pregunta: string;
}