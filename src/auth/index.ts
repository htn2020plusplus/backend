import { AuthChecker } from 'type-graphql'
import firebaseAdmin from 'firebase-admin'

export const authChecker: AuthChecker<any> = async (e: any, a: any) => {
	let authed = false

	const {
		context: { headers },
		info: { fieldName, fieldNodes },
	} = e

	console.log(fieldNodes[0].arguments)
	console.log(fieldName)

	console.log(e.args)
	authed = process.env.admin === headers?.admin
	if (!authed) {
		// eslint-disable-next-line prefer-const
		let uidForMatch = 'VabmFGaffURVNB5Cq56GWva4vcD2'

		if (fieldName === 'createUser') {
			uidForMatch =
				fieldNodes[0].arguments[0].value.fields.filter(
					(x: any) => x.name.value === 'uid'
				)[0].value.value ||
				e.args.data[
					fieldNodes[0].arguments[0].value.fields.filter(
						(x: any) => x.name.value === 'uid'
					)[0].value.name.value
				]
		} else if (fieldName === 'user') {
			console.log(
				fieldNodes[0].arguments[0].value.value ||
					e.args[fieldNodes[0].arguments[0].value.name.value]
			)
		}

		// if (a.includes('admin') && headers.admin) {
		// 	authed = process.env.admin === headers.admin
		// } else if (a.includes('authed') && headers.token) {
		const x = await firebaseAdmin.auth().verifyIdToken(headers.token)

		console.log(x)

		authed = x.uid === uidForMatch
	}
	// }

	return authed // or false if access is denied
}
