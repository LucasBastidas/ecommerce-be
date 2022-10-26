import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { searchProductById } from "../../../controllers/products";
export default methods({
	async get(req: NextApiRequest, res: NextApiResponse) {
		const productId = req.query.productId as string;

		const searchRes = await searchProductById(productId);

		console.log(searchRes);

		if (searchRes) {
			res.status(200).json({ productData: searchRes });
		} else {
			res.status(403).json({ error: "El id no existe" });
		}
	},
});
