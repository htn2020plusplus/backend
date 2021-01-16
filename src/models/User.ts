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
}
