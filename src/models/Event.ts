import { ObjectType, Field, ID } from 'type-graphql'
import {
	Entity,
	BaseEntity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	ManyToOne,
	UpdateDateColumn,
	CreateDateColumn,
	ManyToMany,
} from 'typeorm'
import NamedEntity from './NamedEntity'
import Index from './Index'
import Policy from './Policy'
import Category from './Category'

@ObjectType()
@Entity()
export default class LegislationEvent extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Field()
	@Column()
	text: string // Full text at that point in time

	@UpdateDateColumn()
	@Field(() => Date)
	updatedAt: Date

	@CreateDateColumn()
	@Field(() => Date)
	createdAt: Date

	@Field()
	@Column()
	description: string // Description of all changes between last legislation update and now; ML-generated stuffs

	@Field(() => [Index], { nullable: true })
	@OneToMany(() => Index, (i) => i.legislationEvent, { nullable: true })
	indices?: Index[]

	@Field(() => Date)
	@Column()
	timestamp: Date

	@ManyToOne(() => Policy, (p) => p.legislationEvents, { nullable: true })
	@Field(() => Policy, {
		nullable: true,
	})
	policy?: Policy

	@ManyToMany(() => Category, (l) => l.legislativeEvents, { nullable: true })
	@Field(() => [Category], { nullable: true })
	categories?: Category[]
}
