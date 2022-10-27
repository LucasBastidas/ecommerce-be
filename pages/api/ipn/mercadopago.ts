import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getMerchantOrderById } from "../../../lib/mercadopago";
import {
	getOrderById,
	getOrderName,
	updateAndNotificationOrderMerchant,
	updateOrder,
} from "../../../controllers/order";
import { sendEmailToClient, TemplateClientParams } from "../../../lib/emailjs";
import { firestore, useFireorm } from "../../../lib/firebase";

export default methods({
	async post(req: NextApiRequest, res: NextApiResponse) {
		console.log(firestore.terminate);

		const { id, topic } = req.query;

		if (topic == "merchant_order") {
			const res = await updateAndNotificationOrderMerchant(id);
			// const merchantOrder = await getMerchantOrderById(id as number | string);
			// if (merchantOrder) {
			// 	// const newStatusOrder = merchantOrder.body.status;
			// 	// const orderId = merchantOrder.body.external_reference;
			// 	// const mpRes = merchantOrder.body;
			// 	// console.log(merchantOrder);
			// 	// const orderUpdate = await updateOrder(orderId, newStatusOrder, mpRes);
			// 	// const clientName = await getOrderName(orderId);
			// 	// const orderData = await getOrderById(orderId);
			// 	// const emailParams = {
			// 	// 	from_name: "Ecommerce APX",
			// 	// 	to_name: clientName,
			// 	// 	product_name: orderData.data.title,
			// 	// 	product_price: orderData.data.unit_cost,
			// 	// 	product_description: orderData.data.description,
			// 	// 	reply_to: orderData.email,
			// 	// };
			//    const resupdateAndNotificationOrderMerchant
			// }
		}

		res.send({ ok: "ok" });
	},
});
