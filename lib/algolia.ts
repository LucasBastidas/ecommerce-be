import algolia from "algoliasearch";

const client = algolia(process.env.ALGOLIA_ID, process.env.ALGOLIA_API_KEY);

export const products = client.initIndex("products");
