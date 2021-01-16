import {
	Arg,
	Authorized,
	Field,
	ID,
	InputType,
	Mutation,
	Query,
	Resolver,
} from 'type-graphql'
import User from '../models/User'
import Category from '../models/Category'

const allRelations = ['subscribedCategories']

@InputType()
class CreateUserInput {
	@Field()
	uid: string

	@Field(() => [String])
	categories: string[]
}

@Resolver()
export default class UserResolver {
	@Mutation(() => User)
	@Authorized(['admin', 'authed'])
	async createUser(@Arg('data') data: CreateUserInput) {
		const categories = await Promise.all(
			data.categories.map((v) =>
				Category.findOneOrFail(v, {
					relations: ['subscribedUsers'],
				})
			)
		)

		const user = new User()
		user.id = data.uid

		user.subscribedCategories = categories

		await user.save()

		await Promise.all(
			categories.map(async (c) => {
				c.subscribedUsers?.push(user)
				c.save()
			})
		)

		return user
	}

	@Query(() => User)
	@Authorized(['admin', 'authed'])
	user(@Arg('id') id: string) {
		return User.findOneOrFail(id, {
			relations: allRelations,
		})
	}
}
