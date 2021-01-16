import {
	Arg,
	Field,
	ID,
	InputType,
	Mutation,
	Query,
	Resolver,
} from 'type-graphql'
import Category from '../models/Category'
import LegislationEvent from '../models/Event'
import Index from '../models/Index'
import NamedEntity from '../models/NamedEntity'

const allRelations = [
	'entity',
	'legislationEvent',
	'entity.indices',
	'entity.categories',
]
@InputType()
class CreateIndexInput {
	@Field()
	startPosition: number

	@Field()
	endPosition: number

	@Field()
	entity: string
}

@Resolver()
export default class IndexResolver {
	@Query(() => [Index])
	indices() {
		return Index.find({
			relations: allRelations,
		})
	}

	@Query(() => Index)
	index(@Arg('id', () => ID) id: string) {
		return Index.findOneOrFail(id, {
			relations: allRelations,
		})
	}

	@Mutation(() => Index)
	async createIndex(@Arg('data') data: CreateIndexInput) {
		const entity = await NamedEntity.findOneOrFail(data.entity, {
			relations: ['indices'] as (keyof NamedEntity)[],
		})

		const index = new Index()

		index.startPosition = data.startPosition
		index.endPosition = data.endPosition
		index.entity = entity
		// index.legislationEvent = legislationEvent

		await index.save()

		entity.indices?.push(index)

		await entity.save()

		// legislationEvent.indices?.push(index)

		// await legislationEvent.save()

		return index
	}
}
