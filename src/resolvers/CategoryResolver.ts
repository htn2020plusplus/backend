import { Arg, Field, InputType, Mutation, Query, Resolver } from 'type-graphql'
import Category from '../models/Category'

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
			relations: ['entities', 'policies', 'subscribedUsers'],
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
