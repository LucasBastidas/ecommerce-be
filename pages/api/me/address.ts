import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { middleware } from "../../../lib/middleware";
import { updateUserData } from "../../../controllers/user";
import { meAddressBodySchema } from "../../../lib/yup";

const handler = methods({
	async patch(req: NextApiRequest, res: NextApiResponse, token) {
		if (!req.body) {
			return res.status(200).json({ message: "no data for update" });
		}
		try {
			await meAddressBodySchema.validate(req.body);
		} catch (error) {
			return res.status(404).json({ message: error });
		}
		const { address } = req.body;

		const updateData = await updateUserData(token.userId, req.body);
		return res.status(200).json({ updateData });
	},
});

export default middleware(handler);
