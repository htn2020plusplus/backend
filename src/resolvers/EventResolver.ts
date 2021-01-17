import {
	Arg,
	Field,
	InputType,
	Mutation,
	Query,
	Resolver,
	ID,
} from 'type-graphql'
import Event from '../models/Event'
import Index from '../models/Index'
import Category from '../models/Category'

const allRelations = ['indices', 'policy', 'categories']
@InputType()
class CreateEventInput {
	@Field()
	text: string

	@Field()
	description: string

	@Field()
	timestamp: string

	@Field(() => [String])
	indices: string[]

	@Field(() => [String])
	categories: string[]
}

@Resolver()
export default class EventResolver {
	@Query(() => [Event])
	events() {
		return Event.find({
			relations: allRelations,
		})
	}

	@Query(() => Event)
	event(@Arg('id', () => ID) id: string) {
		return Event.findOneOrFail(id, {
			relations: allRelations,
		})
	}

	@Mutation(() => Event)
	async createEvent(@Arg('data') data: CreateEventInput) {
		const categories = await Promise.all(
			data.categories.map((v) =>
				Category.findOneOrFail(v, {
					relations: ['legislativeEvents'],
				})
			)
		)

		const indices = await Promise.all(
			data.indices.map((z) =>
				Index.findOneOrFail(z, {
					relations: ['legislationEvent'] as (keyof Index)[],
				})
			)
		)

		const event = new Event()

		event.description = data.description
		event.text = data.text
		event.categories = categories
		event.timestamp = new Date(data.timestamp)
		event.categories = categories
		event.indices = indices

		await event.save()

		await Promise.all(
			indices.map(async (z) => {
				z.legislationEvent = event
				await z.save()
			})
		)

		await Promise.all(
			categories.map(async (c) => {
				c.legislativeEvents?.push(event)
				await c.save()
			})
		)

		return event
	}
}
