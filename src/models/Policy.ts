import { ObjectType, Field, ID } from 'type-graphql'
import {
	Entity,
	BaseEntity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	ManyToMany,
} from 'typeorm'
import Category from './Category'
import Index from './Index'
import LegislationEvent from './Events'

@ObjectType()
@Entity()
export default class Policy extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Field()
	@Column()
	text: string

	@Field({ nullable: true })
	@Column({ nullable: true })
	description?: string

	@Field(() => [LegislationEvent])
	@OneToMany(() => LegislationEvent, (le) => le.policy)
	legislationEvents: LegislationEvent[]

	@ManyToMany(() => Category, (c) => c.policies)
	@Field(() => [Category])
	categories: Category[]
}
