import airtable from "airtable";

export const airtableBase = new airtable({
	apiKey: process.env.AIRTABLE_KEY,
}).base(process.env.AIRTABLE_BASE);
