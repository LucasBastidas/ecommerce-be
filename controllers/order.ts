import {
	createOrderPreference,
	getMerchantOrderById,
	PreferenceDataType,
} from "../lib/mercadopago";
import { orderCollection } from "../models/orders";
import { Order, OrderData } from "../models/orders";
import {
	searchProductById,
	updateStockAlgoliaAndAirtable,
} from "../controllers/products";
import { getUserData } from "../controllers/user";
import addMinutes from "date-fns/addMinutes";
import { MercadoPagoMerchantOrder } from "mercadopago/resources/merchantOrders";
import { sendEmailToClient } from "../lib/emailjs";

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

export async function updateOrder(orderId, status, mpResponse) {
	const order = await orderCollection.findById(orderId);
	order.status = status;
	order.mercadopagoRes = mpResponse;
	await orderCollection.update(order);
}

export async function getOrderName(orderId): Promise<string> {
	const order = await orderCollection.findById(orderId);
	const user = await getUserData(order.userId);
	return user.name;
}

export async function updateAndNotificationOrderMerchant(merchantId) {
	const merchantOrder = await getMerchantOrderById(
		merchantId as number | string
	);
	if (merchantOrder) {
		const newStatusOrder = merchantOrder.body.status;
		const orderId = merchantOrder.body.external_reference;
		const mpRes = merchantOrder.body;
		const orderUpdate = await updateOrder(orderId, newStatusOrder, mpRes);
		const clientName = await getOrderName(orderId);
		const orderData = await getOrderById(orderId);
		const emailParams = {
			from_name: "Ecommerce APX",
			to_name: clientName,
			product_name: orderData.data.title,
			product_price: orderData.data.unit_cost,
			product_description: orderData.data.description,
			to: orderData.email,
		};
		const clientEmail = await sendEmailToClient(emailParams);
		const updateProductDb = await updateStockAlgoliaAndAirtable(
			orderData.productId,
			orderData.data.quantity
		);
	}
}
