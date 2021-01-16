import { ObjectType, Field, ID } from 'type-graphql'
import {
	Entity,
	BaseEntity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	ManyToMany,
	JoinTable,
} from 'typeorm'
import Category from './Category'
import Index from './Index'
import LegislationEvent from './Event'

@ObjectType()
@Entity()
export default class Policy extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Field()
	@Column()
	title: string

	@Field()
	@Column()
	text: string

	@Field()
	@Column()
	description: string

	@Field(() => [LegislationEvent], { nullable: true })
	@OneToMany(() => LegislationEvent, (le) => le.policy, { nullable: true })
	@JoinTable({
		name: 'policy_legislation_events',
		joinColumns: [{ name: 'policy_id' }],
		inverseJoinColumns: [{ name: 'legislation_event_id' }],
	})
	legislationEvents?: LegislationEvent[]

	@ManyToMany(() => Category, (c) => c.policies, { nullable: true })
	@Field(() => [Category], { nullable: true })
	@JoinTable({
		name: 'policy_categories',
		joinColumns: [{ name: 'policy_id' }],
		inverseJoinColumns: [{ name: 'category_id' }],
	})
	categories?: Category[]
}
