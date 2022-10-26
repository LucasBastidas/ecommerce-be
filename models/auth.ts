import { useFireorm } from "../lib/firebase";
import { Collection, getRepository } from "fireorm";

@Collection()
export class Auth {
	id: string;
	code: number;
	expires: Date;
	userId: string;
	email: string;
}

export const authCollection = getRepository(Auth);
