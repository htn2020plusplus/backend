import { AuthChecker } from 'type-graphql'

import firebaseAdmin from 'firebase-admin'
import 'firebase/firestore'
import 'firebase/auth'

export const authChecker: AuthChecker<any> = async (e: any, a: any) => {
	let authed = false

	const {
		context: { headers },
		// info: { fieldName, fieldNodes }
	} = e

	if (a.includes('admin') && headers.admin) {
		authed = process.env.admin === headers.admin
	} else if (a.includes('authed') && headers.token) {
		authed = await firebaseAdmin
			.auth()
			.verifyIdToken(headers.token)
			.then(() => true)
			.catch(() => false)
	}

	return authed // or false if access is denied
}
