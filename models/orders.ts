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
	status: "pending" | string;
	aditionalInfo?: any;
	mercadopagoRes?: any;
	name: string;
}

export const orderCollection = getRepository(Order);
