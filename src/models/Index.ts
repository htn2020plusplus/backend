import {
	Entity,
	BaseEntity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
} from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import NamedEntity from './NamedEntity'
import LegislationEvent from './Events'

@ObjectType()
@Entity()
export default class Index extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Field()
	@Column()
	lineNumber: number

	@Field()
	@Column()
	startPosition: number

	@Field()
	@Column()
	endPosition: number

	@ManyToOne(() => NamedEntity, (ne) => ne.indices)
	@Field(() => NamedEntity)
	entity: NamedEntity

	@ManyToOne(() => LegislationEvent, (le) => le.indices)
	@Field(() => LegislationEvent)
	legislationEvent: LegislationEvent
}
