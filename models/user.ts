import { Collection, getRepository } from "fireorm";
import { firestore } from "../lib/firebase";
firestore;

@Collection()
export class User {
	id: string;
	email: string;
	name?: string;
	address?: any;
}

export const userCollection = getRepository(User);
