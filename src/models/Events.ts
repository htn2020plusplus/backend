import { ObjectType, Field, ID } from "type-graphql";
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import NamedEntity from "./NamedEntity";
import Index from './Index';
import Policy from "./Policy";


@ObjectType()
@Entity()
export default class LegislationEvent extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Field()
    @Column()
    text: string // Full text at that point in time

    @Field({nullable: true})
    @Column({nullable: true})
    description?: string // Description of all changes between last legislation update and now; ML-generated stuffs


    @Field(() => [Index])
    @OneToMany(() => Index, (i) => i.)
    indices: Index[]

    @Field(() => Date)
    @Column()
    timestamp: Date

    @ManyToOne(() => Policy, (p) => p.legislationEvents)
    @Field(() => Policy)
    policy: Policy
}