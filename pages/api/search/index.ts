import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { searchProductByQuery } from "../../../controllers/products";

export default methods({
	async get(req: NextApiRequest, res: NextApiResponse) {
		const { q } = req.query;

		if (!q) {
			const searchRes = await searchProductByQuery(req, q);
			return res.status(200).json(searchRes);
		}
		const searchRes = await searchProductByQuery(req, q);
		return res.status(200).json(searchRes);
	},
});
