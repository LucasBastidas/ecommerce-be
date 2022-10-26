import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { middleware } from "../../../lib/middleware";
import { getUserData, updateUserData } from "../../../controllers/user";

const handler = methods({
	async get(req: NextApiRequest, res: NextApiResponse, token) {
		const user = await getUserData(token.userId);
		res.send(user);
	},
	async patch(req: NextApiRequest, res: NextApiResponse, token) {
		const { address, name, email } = req.body;
		if (!address && !name && !email) {
			res.status(204).json({ message: "No data for update" });
		}
		const updateData = await updateUserData(token.userId, req.body);
		res.send({ updateData });
	},
});

export default middleware(handler);
