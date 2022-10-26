import { createOrderPreference, PreferenceDataType } from "../lib/mercadopago";
import { orderCollection } from "../models/orders";
import { Order, OrderData } from "../models/orders";
import { searchProductById } from "../controllers/products";
import { getUserData } from "../controllers/user";
import addMinutes from "date-fns/addMinutes";

type OrderParam = {
	data: OrderData;
	email: string;
	expires: Date;
	productId: string;
	userId: string;
};

export async function createOrder(orderParams: OrderParam, aditionalInfo?) {
	const order = new Order();

	(order.data = orderParams.data),
		(order.email = orderParams.email),
		(order.expires = orderParams.expires),
		(order.productId = orderParams.productId),
		(order.userId = orderParams.userId),
		(order.status = "pending");
	if (aditionalInfo) {
		order.aditionalInfo = aditionalInfo;
	}

	const newOrder = await orderCollection.create(order);

	return newOrder;
}

export async function createOrderAndPreference(
	userId: string,
	productId: string,
	aditionalInfo?
) {
	const product = await searchProductById(productId);

	if (!product) {
		return null;
	}

	const user = await getUserData(userId);

	const newOrderData = {
		productId: product.id,
		data: {
			unit_cost: product.unit_cost,
			title: product.title,
			quantity: 1,
			description: product.description,
			category: product.category,
		},
		expires: addMinutes(new Date(), 60),
		userId: userId,
		email: user.email,
	};

	const newOrder = await createOrder(newOrderData, aditionalInfo);

	const preferenceData = {
		title: newOrder.data.title,
		description: newOrder.data.description,
		quantity: newOrder.data.quantity,
		unit_price: newOrder.data.unit_cost,
		category_id: newOrder.data.category,
	};

	const preference = await createOrderPreference(
		preferenceData,
		user,
		newOrder.id
	);

	return preference;
}

export async function getOrderById(orderId) {
	const order = await orderCollection.findById(orderId);
	return order;
}
