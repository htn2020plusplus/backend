import { Field, ObjectType, ID } from 'type-graphql'
import {
	BaseEntity,
	Column,
	Entity,
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
	description: string // Nullable because descriptions will only come after we add in all the entities

	@Field()
	@Column()
	name: string

	@Field(() => [Index])
	@OneToMany(() => Index, (i) => i.entity)
	indices: Index[]

	@ManyToMany(() => Category, (c) => c.entities)
	@Field(() => [Category])
	categories: Category[]
}
