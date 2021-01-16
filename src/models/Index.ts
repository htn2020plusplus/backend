import {
	Entity,
	BaseEntity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
} from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import NamedEntity from './NamedEntity'
import LegislationEvent from './Event'

@ObjectType()
@Entity()
export default class Index extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Field()
	@Column()
	startPosition: number

	@Field()
	@Column()
	endPosition: number

	@ManyToOne(() => NamedEntity, (ne) => ne.indices, { nullable: true })
	@Field(() => NamedEntity, { nullable: true })
	entity?: NamedEntity

	@ManyToOne(() => LegislationEvent, (le) => le.indices, { nullable: true })
	@Field(() => LegislationEvent, { nullable: true })
	legislationEvent?: LegislationEvent
}
