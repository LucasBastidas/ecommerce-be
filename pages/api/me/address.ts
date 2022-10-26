import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { middleware } from "../../../lib/middleware";
import { getUserData, updateUserData } from "../../../controllers/user";

const handler = methods({
	async patch(req: NextApiRequest, res: NextApiResponse, token) {
		const { address } = req.body;
		if (!address) {
			console.log("hola");
			res.status(200).send({ message: "No address for update" });
		} else {
			const updateData = await updateUserData(token.userId, req.body);
			res.send({ updateData });
		}
	},
});

export default middleware(handler);
