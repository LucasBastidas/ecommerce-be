import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { middleware } from "../../../lib/middleware";
import { createOrderAndPreference } from "../../../controllers/order";

const handler = methods({
	async post(req: NextApiRequest, res: NextApiResponse, token) {
		const { productId } = req.query;
		const { aditionalInfo } = req.body;
		if (!productId) {
			res.status(404).send("No productId");
		}
		const orderRes = await createOrderAndPreference(
			token.userId,
			productId as string,
			aditionalInfo
		);

		if (!orderRes) {
			res.status(404).json({ message: "no product found" });
		}

		res.status(200).json(orderRes);
	},
});

export default middleware(handler);
