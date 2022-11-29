import {
	createOrderPreference,
	getMerchantOrderById,
} from "../lib/mercadopago";
import { orderCollection } from "../models/orders";
import { Order, OrderData } from "../models/orders";
import { searchProductById } from "../controllers/products";
import { getUserData } from "../controllers/user";
import addMinutes from "date-fns/addMinutes";
import { sendEmailToClient, sendEmailToSeller } from "../lib/emailjs";

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

//CREA UNA ORDEN EN LA DB Y LA PREFERENCIA DE COMPRA DE MERCADOPAGO
export async function createOrderAndPreference(
	userId: string,
	productId: string,
	aditionalInfo?
) {
	const product = await searchProductById(productId);

	if (!product) {
		throw "El producto no existe.";
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

//BUSCAR LA ORDER POR ID
export async function getOrderById(orderId) {
	const order = await orderCollection.findById(orderId);
	return order;
}

//ACTUALIZA LA ORDER EN LA DB
export async function updateOrder(orderId, status, mpResponse) {
	const order = await orderCollection.findById(orderId);
	order.status = status;
	order.mercadopagoRes = mpResponse;
	await orderCollection.update(order);
}

//DEVUELVE EL NOMBRE DEL CLIENTE QUE HIZO LA ORDER
export async function getOrderName(orderId): Promise<string> {
	const order = await orderCollection.findById(orderId);
	const user = await getUserData(order.userId);
	return user.name;
}

//ACTUALIZA LA ORDER EN LA DATABASE
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
		const clientData = await getUserData(orderData.userId);

		const emailClientParams = {
			from_name: "Ecommerce APX",
			to_name: clientName,
			product_name: orderData.data.title,
			product_price: orderData.data.unit_cost,
			product_description: orderData.data.description,
			to: orderData.email,
		};

		//ENVIA CORREO DE CONFIRMACIÓN AL CLIENTE
		const clientEmail = await sendEmailToClient(emailClientParams);
		console.log({ 22: orderData.productId, 11: orderData.data.quantity });

		const emailSellerParams = {
			from_name: "Ecommerce APX",
			order_id: orderId,
			product_id: orderData.productId,
			product_name: orderData.data.title,
			product_price: orderData.data.unit_cost,
			product_description: orderData.data.description,
			product_quantity: orderData.data.quantity,
			user_email: clientData.email,
			user_name: clientData.name,
			provincia: clientData.address.provincia,
			ciudad: clientData.address.ciudad,
			calle: clientData.address.calle,
			altura: clientData.address.altura,
		};

		//ENVIA AVISO AL VENDEDOR
		const sellerEmail = await sendEmailToSeller(emailSellerParams);
	}
}
