import sgMail from "@sendgrid/mail";

export type TemplateClientParams = {
	from_name: string;
	to_name: string;
	product_name: string;
	product_price: number;
	product_description: string;
	to: string;
};

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
export async function sendEmailToClient(templateParams: TemplateClientParams) {
	const msg = {
		to: templateParams.to,
		from: "lucaasbastidas@hotmail.com", // Use the email address or domain you verified above
		subject:
			"Notificación sobre tu compra en " + templateParams.from_name + "!",
		html: `<strong>Tu compra de <b>${templateParams.product_name}</b> se realizó con exito!!</strong><br>
               <strong>Detalles de la compra</strong><br>
               <ul>
               <li>Producto: ${templateParams.product_name}</li>
               <li>Precio: $${templateParams.product_price}</li>
               <li>Detalles: ${templateParams.product_description}</li>
               </ul><br>
               <p>Muchas gracias por tu compra! -Tienda yo-</p>`,
	};
	sgMail.send(msg).then(
		() => {},
		(error) => {
			console.error(error);

			if (error.response) {
				console.error(error.response.body);
			}
		}
	);
}
