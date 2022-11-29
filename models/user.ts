import { Collection, getRepository } from "fireorm";
import { firestore } from "../lib/firebase";
firestore;

@Collection()
export class User {
	id: string;
	email: string;
	name?: string;
	telephone_number?: number;
	address?: any;
}

export const userCollection = getRepository(User);
