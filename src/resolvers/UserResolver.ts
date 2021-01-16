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
import NamedEntity from '../models/NamedEntity'
import Policy from '../models/Policy'

const allRelations = [
	'subscribedCategories',
	'subscribedEntities',
	'subscribedPolicies',
]

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
	user(@Arg('id') id: string) {
		return User.findOneOrFail(id, {
			relations: allRelations,
		})
	}

	@Mutation(() => User)
	@Authorized(['admin', 'authed'])
	async followEntity(@Arg('id') id: string, @Arg('entity') entityID: string) {
		const entity = await NamedEntity.findOneOrFail(entityID, {
			relations: ['subscribedUsers'],
		})

		const user = await User.findOneOrFail(id, {
			relations: ['subscribedEntities'],
		})

		entity.subscribedUsers?.push(user)
		user.subscribedEntities?.push(entity)

		await entity.save()
		await user.save()

		return user
	}

	@Mutation(() => User)
	@Authorized(['admin', 'authed'])
	async followCategory(
		@Arg('id') id: string,
		@Arg('category') entityID: string
	) {
		const entity = await Category.findOneOrFail(entityID, {
			relations: ['subscribedUsers'],
		})

		const user = await User.findOneOrFail(id, {
			relations: ['subscribedEntities'],
		})

		entity.subscribedUsers?.push(user)
		user.subscribedCategories?.push(entity)

		await entity.save()
		await user.save()

		return user
	}

	@Mutation(() => User)
	@Authorized(['admin', 'authed'])
	async followPolicy(@Arg('id') id: string, @Arg('policy') entityID: string) {
		const entity = await Policy.findOneOrFail(entityID, {
			relations: ['subscribedUsers'],
		})

		const user = await User.findOneOrFail(id, {
			relations: ['subscribedEntities'],
		})

		entity.subscribedUsers?.push(user)
		user.subscribedPolicies?.push(entity)

		await entity.save()
		await user.save()

		return user
	}
}
