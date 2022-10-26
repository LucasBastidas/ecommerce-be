import jwt from "jsonwebtoken";

//GENERAMOS EL JWT CON EL USERID
export function generate(obj) {
	return jwt.sign(obj, process.env.JWT_SECRET);
}

export function decode(token) {
	try {
		return jwt.verify(token, process.env.JWT_SECRET);
	} catch (e) {
		console.error("token incorrecto");
		return null;
	}
}
