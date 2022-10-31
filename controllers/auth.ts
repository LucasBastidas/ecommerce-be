import { User } from "../models/user";
import { Auth, authCollection } from "../models/auth";
import { createUser } from "./user";
import { generate } from "../lib/jwt";
import sgMail from "@sendgrid/mail";
import addMinutes from "date-fns/addMinutes";

export async function createNewAuth(userId: string, email: string) {
	const newAuth = new Auth();
	newAuth.email = email;
	newAuth.userId = userId;
	const authInFirebase = await authCollection.create(newAuth); // Create doc
	return authInFirebase;
}

function getRandomArbitrary(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}

export async function findOrCreateAuth(email: string): Promise<any> {
	// const auth = await authCollection.findOne(email); // Read doc
	const auth = await authCollection.whereEqualTo("email", email).find(); // Read doc
	// console.log(auth);

	if (auth.length != 0) {
		// console.log(auth);

		return auth[0];
	} else {
		const newUser = await createUser(email);
		const newUserId = newUser.id;
		const newAuth = await createNewAuth(newUserId, email);
		console.log("pulia", newAuth);

		return newAuth;
	}
}

async function sendEmail(email, code) {
	sgMail.setApiKey(process.env.SENDGRID_API_KEY);
	const msg = {
		to: email,
		from: "lucaasbastidas@hotmail.com", // Use the email address or domain you verified above
		subject: "TU CODIGO PARA INGRESAR",
		text: "CODIGO: " + code,
	};

	const enviado = await sgMail.send(msg);
}

export async function sendCode(email) {
	const cleanEmail = email.trim().toLowerCase();
	const auth = await findOrCreateAuth(cleanEmail);

	const code = getRandomArbitrary(999999, 10000);
	const now = new Date();
	const twentyMinutesFromNow = addMinutes(now, 25);

	const myAuth = await authCollection.findById(auth.id);

	myAuth.code = code;
	myAuth.expires = twentyMinutesFromNow;

	const update = await authCollection.update(myAuth).then(async () => {
		await sendEmail(cleanEmail, code);
	});

	return true;
}

export async function findAuthAndGetToken(email, code) {
	const cleanEmail = email.trim().toLowerCase();
	const auth = await authCollection.whereEqualTo("email", email).find();

	if (auth.length == 0) {
		console.error("No se encontro el email");
		return null;
	}
	const myAuth = auth[0];
	const now = new Date();

	//CHEKEA QUE EL CODIGO SEA IGUAL Y QUE NO ESTE VENCIDO
	if (myAuth.code == code && now < myAuth.expires) {
		//GENERA EL TOKEN
		const token = generate({ userId: myAuth.userId });

		//INVALIDAMOS EL CODIGO ACTUALIZANDO LA HORA EN QUE EXPIRA
		const authUpdate = await authCollection.findById(myAuth.id);

		authUpdate.expires = new Date();

		await authCollection.update(authUpdate);

		return { token };
	} else {
		return null;
	}
}
