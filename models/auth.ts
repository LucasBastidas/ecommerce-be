import { Collection, getRepository } from "fireorm";
import { firestore } from "../lib/firebase";
firestore;

@Collection()
export class Auth {
	id: string;
	code: number;
	expires: Date;
	userId: string;
	email: string;
}

export const authCollection = getRepository(Auth);
