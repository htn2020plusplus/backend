import { Arg, Field, InputType, Mutation, Query, Resolver } from 'type-graphql'
import Event from '../models/Event'
import Index from '../models/Index'

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
}

@Resolver()
export default class EventResolver {
	@Query(() => [Event])
	categories() {
		return Event.find({
			relations: ['entities', 'policies', 'subscribedUsers'],
		})
	}

	@Mutation(() => Event)
	async createEvent(@Arg('data') data: CreateEventInput) {
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
		event.timestamp = new Date(data.timestamp)
		event.indices = indices

		await event.save()

		await Promise.all(
			indices.map(async (z) => {
				z.legislationEvent = event
				await z.save()
			})
		)

		return event
	}
}
