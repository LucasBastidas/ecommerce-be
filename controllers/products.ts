import { airtableBase, updateProductStockAirtable } from "../lib/airtable";
import { products, updateStockAlgolia } from "../lib/algolia";
import { NextApiRequest } from "next";

//SINCRONIZA AIRTABLE CON ALGOLIA
export function syncAirtableWithAlgolia() {
	airtableBase("Products")
		.select({})
		.eachPage(
			function page(records, fetchNextPage) {
				const results = records.map((r) => {
					return {
						...r.fields,
						objectID: r.id,
					};
				});
				products.saveObjects(results);

				fetchNextPage();
				console.log("OTRA PAG");
			},
			function done(err) {
				if (err) {
					console.error(err);
					return;
				}
			}
		);
}

function getLimitAndOffset(req: NextApiRequest, maxLimit, maxOffset = 1000) {
	var limit = 10;
	var offset = 0;

	const queryLimit = parseInt(req.query.limit as string);
	const queryOffset = parseInt(req.query.offset as string);

	limit =
		queryLimit != undefined
			? queryLimit <= maxLimit
				? queryLimit
				: maxLimit
			: limit;
	offset = queryOffset < maxOffset ? queryOffset : 0;

	return {
		limit,
		offset,
	};
}

//BUSCA UN PRODUCTO EN ALGOLIA
export async function searchProductByQuery(req: NextApiRequest, query) {
	const totalProductos = await products.search(query as string);
	const { limit, offset } = getLimitAndOffset(req, 10, totalProductos.nbHits);

	const searchQuery = await products.search(query as string, {
		offset,
		length: limit,
	});

	const searchQueryResults = searchQuery.hits;
	return {
		results: searchQuery.hits,
		pagination: {
			offset: offset,
			limit: limit,
			total: totalProductos.nbHits,
		},
	};
}

//BUSCA UN PRODUCTO POR ID
export async function searchProductById(productId: string) {
	try {
		const busqueda = (await products.getObject(productId)) as any;

		const cleanProduct = {
			title: busqueda.title,
			category: busqueda.category,
			unit_cost: busqueda["unit-cost"],
			image: busqueda.images[0].url,
			description: busqueda.description,
			id: busqueda.objectID,
			stock: busqueda.stock,
		};

		return cleanProduct;
	} catch (error) {
		console.error(error);
		return null;
	}
}

//CAMBIA EL STOCK DE UN PRODUCTO EN ALGOLIA Y AIRTABLE
export async function updateStockAlgoliaAndAirtable(
	productId: string,
	itemsSold: number
) {
	const algolia = await updateStockAlgolia(productId, itemsSold);
	const airtable = await updateProductStockAirtable(productId, itemsSold);
}
