import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getMerchantOrderById } from "../../../lib/mercadopago";
import {
	getOrderById,
	getOrderName,
	updateOrder,
} from "../../../controllers/order";
import { sendEmailToClient, TemplateClientParams } from "../../../lib/emailjs";

export default methods({
	async post(req: NextApiRequest, res: NextApiResponse) {
		const { id, topic } = req.query;

		if (topic == "merchant_order") {
			const merchantOrder = await getMerchantOrderById(id as number | string);
			if (merchantOrder) {
				const newStatusOrder = merchantOrder.body.status;
				const orderId = merchantOrder.body.external_reference;
				const mpRes = merchantOrder.body;
				console.log(merchantOrder);
				const orderUpdate = await updateOrder(orderId, newStatusOrder, mpRes);
				const clientName = await getOrderName(orderId);
				const orderData = await getOrderById(orderId);
				// const emailParams = {
				// 	from_name: "Ecommerce APX",
				// 	to_name: clientName,
				// 	product_name: orderData.data.title,
				// 	product_price: orderData.data.unit_cost,
				// 	product_description: orderData.data.description,
				// 	reply_to: orderData.email,
				// };
				// const clientEmail = await sendEmailToClient(emailParams);
			}
		}

		res.send({ ok: "ok" });
	},
});
