import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { middleware } from "../../../lib/middleware";
import { createOrderAndPreference } from "../../../controllers/order";
import { orderQuerySchema, orderBodySchema } from "../../../lib/yup";

const handler = methods({
	async post(req: NextApiRequest, res: NextApiResponse, token) {
		try {
			await orderQuerySchema.validate(req.query);
		} catch (error) {
			return res.status(404).send({ message: error });
		}
		const { productId } = req.query;

		if (req.body) {
			try {
				await orderBodySchema.validate(req.body);
			} catch (error) {
				return res.status(404).send({ message: error });
			}
		}

		const aditionalInfo = req.body;

		try {
			const orderRes = await createOrderAndPreference(
				token.userId,
				productId as string,
				aditionalInfo
			);
			return res.status(200).json(orderRes);
		} catch (error) {
			return res.status(404).send({ message: error });
		}
	},
});

export default middleware(handler);
