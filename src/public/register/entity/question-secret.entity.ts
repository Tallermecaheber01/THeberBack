import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ClientEntity } from "src/public/recover-password/entity/client-entity";
import { AuthorizedPersonnelEntity } from "src/public/recover-password/entity/authorized-personnel-entity";

@Entity('questionsecret')
export class QuestionSecretEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type:'text', nullable:false})
    pregunta: string;

    @OneToMany(()=> ClientEntity,(client) => client.preguntaSecreta)
    clientes: ClientEntity[];

    @OneToMany(() => AuthorizedPersonnelEntity, (empleado) => empleado.preguntaSecreta)
    personal: AuthorizedPersonnelEntity[];
}