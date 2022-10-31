import * as yup from "yup";

export const authBodySchema = yup
	.object()
	.shape({
		email: yup.string().required(),
	})
	.noUnknown(true)
	.strict();

export const authTokenBodySchema = yup
	.object()
	.shape({
		email: yup.string().required(),
		code: yup.number().required(),
	})
	.noUnknown(true)
	.strict();

export const meAddressBodySchema = yup
	.object()
	.shape({
		address: yup
			.object()
			.shape({
				pais: yup.string().notRequired(),
				provincia: yup.string().notRequired(),
				ciudad: yup.string().notRequired(),
				direccion: yup
					.object()
					.shape({
						calle: yup.string().notRequired(),
						altura: yup.number().notRequired(),
					})
					.noUnknown(true),
			})
			.noUnknown(true),
	})
	.noUnknown(true)
	.strict();

export const orderQuerySchema = yup.object().shape({
	productId: yup.string().required(),
});

export const orderBodySchema = yup
	.object()
	.shape({
		color: yup.string().notRequired(),
		informacion_extra: yup.string().notRequired(),
	})
	.noUnknown(true)
	.strict();
