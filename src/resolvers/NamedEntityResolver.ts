import { Arg, Field, InputType, Mutation, Query, Resolver } from 'type-graphql'
import Category from '../models/Category'
import NamedEntity from '../models/NamedEntity'

const allRelations: (keyof NamedEntity)[] = ['categories', 'indices']

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
	categories() {
		return NamedEntity.find({
			relations: allRelations,
		})
	}

	@Mutation(() => NamedEntity)
	async createNamedEntity(@Arg('data') data: CreateNamedEntityInput) {
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
