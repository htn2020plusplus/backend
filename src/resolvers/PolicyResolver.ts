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
import Policy from '../models/Policy'

const allRelations = ['legislationEvents', 'categories']

@InputType()
class CreatePolicyInput {
	@Field()
	title: string

	@Field()
	description: string

	@Field()
	text: string

	@Field(() => [String])
	legislationEvents: string[]

	@Field(() => [String])
	categories: string[]
}

@Resolver()
export default class PolicyResolver {
	@Query(() => [Policy])
	policies() {
		return Policy.find({
			relations: allRelations,
		})
	}

	@Query(() => Policy)
	policy(@Arg('id', () => ID) id: string) {
		return Policy.findOneOrFail(id, {
			relations: allRelations,
		})
	}

	@Mutation(() => Policy)
	async createPolicy(@Arg('data') data: CreatePolicyInput) {
		const categories = await Promise.all(
			data.categories.map((v) =>
				Category.findOneOrFail(v, {
					join: {
						alias: 'category',
						leftJoinAndSelect: {
							policies: 'category.policies',
						},
					},
				})
			)
		)

		const legislationEvents = await Promise.all(
			data.legislationEvents.map((v) =>
				LegislationEvent.findOneOrFail(v, {
					relations: ['policies'],
				})
			)
		)

		const policy = new Policy()

		policy.legislationEvents = legislationEvents
		policy.categories = categories

		policy.text = data.text
		policy.title = data.title
		policy.description = data.description

		await policy.save()

		await Promise.all(
			categories.map(async (category) => {
				category.policies?.push(policy)
				await category.save()
			})
		)

		await Promise.all(
			legislationEvents.map(async (legislationEvent) => {
				legislationEvent.policy = policy
				await legislationEvent.save()
			})
		)

		return policy
	}
}
