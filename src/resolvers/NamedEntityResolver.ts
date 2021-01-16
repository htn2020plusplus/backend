import {
	Arg,
	Field,
	InputType,
	Mutation,
	Query,
	Resolver,
	ID,
} from 'type-graphql'
import Category from '../models/Category'
import NamedEntity from '../models/NamedEntity'

const allRelations = [
	'categories',
	'categories.policies',
	'categories.subscribedUsers',
	'indices',
	'indices.legislationEvent',
]

@InputType()
class CreateNamedEntityInput {
	@Field()
	name: string

	@Field()
	description: string

	@Field(() => [String])
	categories: string[]
}

@Resolver()
export default class NamedEntityResolver {
	@Query(() => [NamedEntity])
	namedEntities() {
		return NamedEntity.find({
			relations: allRelations,
		})
	}

	@Query(() => NamedEntity)
	async namedEntity(@Arg('id', () => ID) id: string) {
		return NamedEntity.findOneOrFail(id, {
			relations: allRelations,
		})
	}

	@Mutation(() => NamedEntity)
	async createNamedEntity(@Arg('data') data: CreateNamedEntityInput) {
		const n = await NamedEntity.findOne({
			where: {
				name: data.name,
			},
		})

		if (n !== undefined) {
			return n
		}

		const categories = await Promise.all(
			data.categories.map((x) =>
				Category.findOneOrFail(x, {
					relations: ['entities'],
				})
			)
		)

		const entity = new NamedEntity()

		entity.categories = categories
		entity.description = data.description
		entity.indices = []
		entity.name = data.name

		await entity.save()

		await Promise.all(
			categories.map(async (x) => {
				x.entities?.push(entity)
				await x.save()
			})
		)

		return entity
	}
}
