import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { sendCode } from "../../../controllers/auth";
import { authBodySchema } from "../../../lib/yup";

export default methods({
	async post(req: NextApiRequest, res: NextApiResponse) {
		//CHECKEA EL BODY
		console.log({ req, res });

		try {
			await authBodySchema.validate(req.body);
		} catch (error) {
			return res.status(404).json({ message: error });
		}

		const email = req.body.email;

		const auth = await sendCode(email);

		if (!auth) {
			return res.status(403).json({ error: "error" });
		}
		return res.status(200).json({ success: auth });
	},
});
