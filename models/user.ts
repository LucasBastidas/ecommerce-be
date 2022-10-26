import { useFireorm } from "../lib/firebase";
import { Collection, getRepository } from "fireorm";

@Collection()
export class User {
	id: string;
	email: string;
	name?: string;
	lastname?: string;
	address?: string;
}

export const userCollection = getRepository(User);
