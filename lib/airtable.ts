import airtable from "airtable";

export const airtableBase = new airtable({
	apiKey: process.env.AIRTABLE_KEY,
}).base(process.env.AIRTABLE_BASE);

export async function updateProductStockAirtable(
	productId: string,
	itemsSold: number
) {
	const product = await airtableBase("Products").find(productId);
	const actualStock = product.fields.stock as number;
	const productUpdate = await product.patchUpdate({
		stock: actualStock - itemsSold,
	});
}
