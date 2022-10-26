import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { middleware } from "../../../lib/middleware";
import { getMyOrders } from "../../../controllers/user";

const handler = methods({
	async get(req: NextApiRequest, res: NextApiResponse, token) {
		const myOrders = await getMyOrders(token.userId);
		if (!myOrders) {
			res.status(200).json({ message: "No orders founded " });
		}

		res.status(200).json({ myOrders });
	},
});

export default middleware(handler);
