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
	PrimaryColumn,
} from 'typeorm'
import NamedEntity from './NamedEntity'
import Policy from './Policy'
import Category from './Category'

@ObjectType()
@Entity()
export default class User extends BaseEntity {
	@Field(() => ID)
	@PrimaryColumn()
	id: string

	@ManyToMany(() => Category, (c) => c.subscribedUsers, { nullable: true })
	@Field(() => [Category], { nullable: true })
	subscribedCategories?: Category[]

	@ManyToMany(() => NamedEntity, (c) => c.subscribedUsers, { nullable: true })
	@Field(() => [NamedEntity], { nullable: true })
	subscribedEntities?: NamedEntity[]

	@ManyToMany(() => Policy, (c) => c.subscribedUsers, { nullable: true })
	@Field(() => [Policy], { nullable: true })
	subscribedPolicies?: Policy[]
}
