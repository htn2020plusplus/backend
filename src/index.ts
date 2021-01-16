import 'reflect-metadata'
import { createConnection } from 'typeorm'
import { ApolloServer } from 'apollo-server'
import { buildSchema } from 'type-graphql'
import { authChecker } from './auth/index'
import NamedEntity from './models/NamedEntity'
import Category from './models/Category'
import Policy from './models/Policy'
import Index from './models/Index'
import LegislationEvent from './models/Event'
import User from './models/User'
import CategoryResolver from './resolvers/CategoryResolver'
import PolicyResolver from './resolvers/PolicyResolver'
import EventResolver from './resolvers/EventResolver'
import IndexResolver from './resolvers/IndexResolver'
import NamedEntityResolver from './resolvers/NamedEntityResolver'

async function main() {
	await createConnection({
		type: 'postgres',
		synchronize: true,
		url: 'postgres://postgres@localhost:4445/postgres',
		entities: [NamedEntity, Category, Policy, Index, LegislationEvent, User],
	})

	const schema = await buildSchema({
		resolvers: [
			CategoryResolver,
			PolicyResolver,
			CategoryResolver,
			EventResolver,
			IndexResolver,
			NamedEntityResolver,
			PolicyResolver,
		], // TODO
		authChecker: authChecker, // TODO: UDPATE AUTH CHECKER
		validate: false,
	})

	const server = new ApolloServer({
		schema,
		introspection: true,
		playground: true,
		context: ({ req }) => {
			const context = req
			return context
		},
	})
	await server.listen(process.env.PORT || 3000)
	console.log('Legist server has started!')
}

main()
