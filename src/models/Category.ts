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

	@ManyToMany(() => NamedEntity, (n) => n.categories)
	@Field(() => [NamedEntity])
	entities: NamedEntity[]

	@ManyToMany(() => Policy, (n) => n.categories)
	@Field(() => [Policy])
	policies: Policy[]

	@ManyToMany(() => User, (u) => u.subscribedCategories)
	@Field(() => [User])
	subscribedUsers: User[]
}
