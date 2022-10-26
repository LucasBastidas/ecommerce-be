import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";

export default methods({
	async post(req: NextApiRequest, res: NextApiResponse) {
		const { id, topic } = req.query;

		if (topic == "merchant_order") {
			console.log({ id, topic });
		}

		res.send({ ok: "ok" });
	},
});
