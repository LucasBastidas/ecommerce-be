import algolia from "algoliasearch";

const client = algolia(process.env.ALGOLIA_ID, process.env.ALGOLIA_API_KEY);

export const products = client.initIndex("products");

export async function updateStockAlgolia(productId: string, itemsSold: number) {
	try {
		const busqueda = (await products.getObject(productId)) as any;
		const actualStock = busqueda.stock;
		products.partialUpdateObject({
			objectID: productId,
			stock: actualStock - itemsSold,
		});
	} catch (error) {
		console.error(error);
	}
}
