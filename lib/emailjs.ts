import emailjs from "@emailjs/browser";

export type TemplateClientParams = {
	from_name: string;
	to_name: string;
	product_name: string;
	product_price: number;
	product_description: string;
	reply_to: string;
};

export function sendEmailToClient(templateParams: TemplateClientParams) {
	emailjs.send(
		process.env.EMAILJS_SERVICE_ID,
		process.env.EMAILJS_TEMPLATE_ID,
		templateParams,
		process.env.EMAILJS_PUBLIC_KEY
	);
}
