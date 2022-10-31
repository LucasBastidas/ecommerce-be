import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { findAuthAndGetToken } from "../../../controllers/auth";
import { authTokenBodySchema } from "../../../lib/yup";

export default methods({
	async post(req: NextApiRequest, res: NextApiResponse) {
		try {
			await authTokenBodySchema.validate(req.body);
		} catch (error) {
			res.status(404).json({ message: error });
		}

		const { email, code } = req.body;

		if (!email) {
			res.status(403).json({ error: "no email" });
		}

		const auth = await findAuthAndGetToken(email, code);
		if (!auth) {
			res.status(403).json({ error: "email o codigo incorrecto" });
		}
		res.status(200).json({ success: auth });
	},
});
