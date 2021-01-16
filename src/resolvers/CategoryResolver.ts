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

const allRelations = ['entities', 'policies', 'subscribedUsers']
@InputType()
class CreateCategoryInput {
	@Field()
	title: string

	@Field()
	description: string
}

@Resolver()
export default class CategoryResolver {
	@Query(() => [Category])
	categories() {
		return Category.find({
			relations: allRelations,
		})
	}

	@Query(() => Category)
	category(@Arg('id', () => ID) id: string) {
		return Category.findOneOrFail(id, {
			relations: allRelations,
		})
	}

	@Mutation(() => Category)
	async createCategory(@Arg('data') data: CreateCategoryInput) {
		const category = new Category()

		Object.assign(category, data)

		category.policies = []
		category.subscribedUsers = []
		category.entities = []

		await category.save()

		return category
	}
}
