import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { findOrCreateAuth, sendCode } from "../../../controllers/auth";

export default methods({
	async post(req: NextApiRequest, res: NextApiResponse) {
		const email = req.body.email;
		if (!email) {
			res.status(403).json({ error: "no email" });
		}
		const auth = await sendCode(email);
		if (!auth) {
			res.status(403).json({ error: "error" });
		}
		res.status(200).json({ success: auth });
	},
});
