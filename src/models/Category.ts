import { FILE } from 'dns'
import {
	ObjectType,
	Field,
	ID,
	FieldResolver,
	Resolver,
	Root,
	Arg,
} from 'type-graphql'
import {
	Entity,
	BaseEntity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	ManyToOne,
	ManyToMany,
	JoinTable,
	UpdateDateColumn,
	CreateDateColumn,
} from 'typeorm'
import NamedEntity from './NamedEntity'
import Policy from './Policy'
import User from './User'
import { PaginationInput } from './Pagination'
import LegislationEvent from './Event'

@ObjectType()
@Entity()
export default class Category extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Field()
	@Column()
	title: string

	@Field()
	@Column()
	description: string

	@ManyToMany(() => NamedEntity, (n) => n.categories, { nullable: true })
	@Field(() => [NamedEntity], { nullable: true })
	@JoinTable({
		name: 'category_entities',
		joinColumns: [{ name: 'category_id' }],
		inverseJoinColumns: [{ name: 'entity_id' }],
	})
	entities?: NamedEntity[]

	@UpdateDateColumn()
	@Field(() => Date)
	updatedAt: Date

	@CreateDateColumn()
	@Field(() => Date)
	createdAt: Date

	@ManyToMany(() => LegislationEvent, (l) => l.categories, { nullable: true })
	@Field(() => [LegislationEvent], { nullable: true })
	@JoinTable({
		name: 'category_legislative_events',
		joinColumns: [{ name: 'category_id' }],
		inverseJoinColumns: [{ name: 'legislative_id' }],
	})
	legislativeEvents?: LegislationEvent[]

	@ManyToMany(() => Policy, (n) => n.categories, { nullable: true })
	@Field(() => [Policy], { nullable: true })
	policies?: Policy[]

	@ManyToMany(() => User, (u) => u.subscribedCategories, { nullable: true })
	@Field(() => [User], { nullable: true })
	@JoinTable({
		name: 'category_subbed_users',
		joinColumns: [{ name: 'category_id' }],
		inverseJoinColumns: [{ name: 'user_id' }],
	})
	subscribedUsers?: User[]
}
