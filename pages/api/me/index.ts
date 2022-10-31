import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { middleware } from "../../../lib/middleware";
import { getUserData, updateUserData } from "../../../controllers/user";

const handler = methods({
	async get(req: NextApiRequest, res: NextApiResponse, token) {
		const user = await getUserData(token.userId);
		return res.send(user);
	},
	async patch(req: NextApiRequest, res: NextApiResponse, token) {
		if (!req.body) {
			return res.status(204).send({ message: "No data for update" });
		}
		const { address, name, email } = req.body;
		if (!address && !name && !email) {
			return res.status(204).json({ message: "No data for update" });
		}
		const updateData = await updateUserData(token.userId, req.body);
		return res.send({ updateData });
	},
});

export default middleware(handler);
