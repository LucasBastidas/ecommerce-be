import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { updateAndNotificationOrderMerchant } from "../../../controllers/order";

export default methods({
	async post(req: NextApiRequest, res: NextApiResponse) {
		const { id, topic } = req.query;

		if (topic == "merchant_order") {
			const res = await updateAndNotificationOrderMerchant(id);
		}

		return res.send({ ok: "ok" });
	},
});
