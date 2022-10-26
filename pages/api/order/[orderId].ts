import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getOrderById } from "../../../controllers/order";

export default methods({
	async get(req: NextApiRequest, res: NextApiResponse) {
		const orderId = req.query.orderId;
		const order = await getOrderById(orderId);
		if (!order) {
			res.status(404).send({ message: "Order not found" });
		} else {
			res.status(200).send({ order });
		}
	},
});
