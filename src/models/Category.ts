import { FILE } from 'dns'
import { ObjectType, Field, ID } from 'type-graphql'
import {
	Entity,
	BaseEntity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	ManyToOne,
	ManyToMany,
	JoinTable,
} from 'typeorm'
import NamedEntity from './NamedEntity'
import Policy from './Policy'
import User from './User'

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
