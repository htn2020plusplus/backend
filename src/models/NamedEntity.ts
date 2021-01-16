import { Field, ObjectType, ID } from 'type-graphql'
import {
	BaseEntity,
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm'
import Category from './Category'
import Index from './Index'

@Entity()
@ObjectType()
export default class NamedEntity extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Field()
	@Column()
	description: string

	@Field()
	@Column()
	name: string

	@Field(() => [Index], { nullable: true })
	@OneToMany(() => Index, (i) => i.entity, { nullable: true })
	indices?: Index[]

	@ManyToMany(() => Category, (c) => c.entities, { nullable: true })
	@Field(() => [Category], { nullable: true })
	categories?: Category[]
}
