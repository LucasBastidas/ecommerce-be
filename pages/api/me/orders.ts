import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { middleware } from "../../../lib/middleware";
import { getMyOrders } from "../../../controllers/user";

const handler = methods({
	async get(req: NextApiRequest, res: NextApiResponse, token) {
		const myOrders = await getMyOrders(token.userId);
		if (!myOrders) {
			return res.status(200).json({ message: "No orders founded " });
		}

		return res.status(200).json({ myOrders });
	},
});

export default middleware(handler);
