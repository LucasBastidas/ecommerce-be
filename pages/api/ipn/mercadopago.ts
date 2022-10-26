import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getMerchantOrderById } from "../../../lib/mercadopago";

export default methods({
	async post(req: NextApiRequest, res: NextApiResponse) {
		const { id, topic } = req.query;

		if (topic == "merchant_order") {
			const merchantOrder = await getMerchantOrderById(id as number | string);
			console.log(merchantOrder);
		}

		res.send({ ok: "ok" });
	},
});
