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

	@Field()
	legislationEvent: string

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

	@Mutation(() => Category)
	async createPolicy(@Arg('data') data: CreatePolicyInput) {
		const categories = await Promise.all(
			data.categories.map((v) =>
				Category.findOneOrFail(v, {
					relations: ['policies'],
				})
			)
		)

		const legislationEvent = await LegislationEvent.findOneOrFail(
			data.legislationEvent,
			{
				relations: ['policy'],
			}
		)

		const policy = new Policy()

		policy.legislationEvents = [legislationEvent]
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

		legislationEvent.policy = policy
		await legislationEvent.save()

		return policy
	}
}
