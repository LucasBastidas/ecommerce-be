import { useFireorm } from "../lib/firebase";
import { Collection, getRepository } from "fireorm";

export type OrderData = {
	unit_cost: number;
	title: string;
	quantity: number;
	description: string;
	category: string;
};

@Collection()
export class Order {
	id: string;
	productId: string;
	data: OrderData;
	expires: Date;
	userId: string;
	email: string;
	status: "failure" | "succes" | "pending";
	aditionalInfo?: any;
}

export const orderCollection = getRepository(Order);
