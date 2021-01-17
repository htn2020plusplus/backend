import 'reflect-metadata'
import fs from 'fs'
import path from 'path'

import dotenv from 'dotenv'
dotenv.config()

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
import UserResolver from './resolvers/UserResolver'
import firebaseAdmin from 'firebase-admin'

firebaseAdmin.initializeApp({
	credential: firebaseAdmin.credential.cert(
		JSON.parse(process.env.adminSecret as string)
	),
})

async function main() {
	// await createConnection({
	// 	type: 'cockroachdb',
	// 	synchronize: true,
	// 	url: `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}.${process.env.DB_DB}`,
	// 	host: `${process.env.DB_HOST}`,
	// 	ssl: {
	// 		rejectUnauthorized: false,
	// 		ca: fs.readFileSync(path.resolve(__dirname, 'certs/be_cert.crt')),
	// 	},
	// 	entities: [NamedEntity, Category, Policy, Index, LegislationEvent, User],
	// })

	await createConnection({
		type: 'postgres',
		host: 'ec2-3-215-76-208.compute-1.amazonaws.com',
		database: 'd8t5a3cnmc7pb7',
		username: 'elimuoxmsxdizx',
		port: 5432,
		password:
			'70fbc2e7aaeb68b4a5e6833ce3b1878f51e54b89a841540ec83a57e6eba4e18f',
		entities: [NamedEntity, Category, Policy, Index, LegislationEvent, User],
		synchronize: true,
		ssl: {
			rejectUnauthorized: false,
		},
	})

	console.log(
		`postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}.${process.env.DB_DB}`
	)

	const schema = await buildSchema({
		resolvers: [
			CategoryResolver,
			PolicyResolver,
			EventResolver,
			IndexResolver,
			NamedEntityResolver,
			UserResolver,
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
