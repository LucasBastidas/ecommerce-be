import mercadopago from "mercadopago";
import { User } from "../models/user";

mercadopago.configure({
	access_token: process.env.MERCADOPAGO_API_ACCESS_TOKEN,
});

export type PreferenceDataType = {
	title: string;
	description: string;
	quantity: number;
	unit_price: number;
	category_id: string;
};

// export type UserDataForPreferenceType = {
// 	id: string;
// 	name: string;
// 	email: string;
// };

//CREAR ORDER PARA UN SOLO ITEM

export async function createOrderPreference(
	preferenceData: PreferenceDataType,
	userData: User,
	orderId: string
) {
	var preference = {
		items: [
			{
				title: preferenceData.title,
				description: preferenceData.description,
				quantity: 1,
				currency_id: "ARS",
				unit_price: preferenceData.unit_price,
				category_id: preferenceData.category_id,
			},
		],
		payer: {
			identification: { id: userData.id },
			email: userData.email,
			name: userData.name,
		},
		back_urls: {
			succes: "https://apx.school/success",
			pending: "https://apx.school/pending-payments",
		},
		external_reference: orderId, //EXTERNAL REFERENCE ENVIA EL ID DE LA ORDER DE NUESTRA DB PARA PODER ACTUALIZAR EL ESTADO
		notification_url:
			"https://ecommerce-be-weld.vercel.app/api/ipn/mercadopago",
		metadata: {},
	};

	const res = await mercadopago.preferences.create(preference as any);
	return { url: res.body.init_point };
}

export async function gerMerchantOrderById(merchantOrderId: string | number) {
	const mercharntOrder = await mercadopago.merchant_orders.findById(
		merchantOrderId
	);
	return mercharntOrder;
}
