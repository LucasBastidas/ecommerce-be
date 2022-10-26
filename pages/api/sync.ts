import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { syncAirtableWithAlgolia } from "../../controllers/products";

export default methods({
	async post(req: NextApiRequest, res: NextApiResponse) {
		syncAirtableWithAlgolia();

		res.status(200).json("sync");
	},
});
