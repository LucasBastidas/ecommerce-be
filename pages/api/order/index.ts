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
			res.status(404).send({ message: error });
		}
		const { productId } = req.query;
		const aditionalInfo = req.body;

		if (aditionalInfo) {
			try {
				await orderBodySchema.validate(aditionalInfo);
			} catch (error) {
				res.status(404).send({ message: error });
			}
		}

		try {
			const orderRes = await createOrderAndPreference(
				token.userId,
				productId as string,
				aditionalInfo
			);
			res.status(200).json(orderRes);
		} catch (error) {
			res.status(404).send({ message: error });
		}
	},
});

export default middleware(handler);
