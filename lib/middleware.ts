import { NextApiRequest, NextApiResponse } from "next";
import parseToken from "parse-bearer-token";
import { decode } from "./jwt";

//middleware devuelve una función

export function middleware(callback) {
	//Esta función recibe el req con el token
	return function (req: NextApiRequest, res: NextApiResponse) {
		const token = parseToken(req);

		if (!token) {
			res.status(404).send({ message: "token not found" });
		}

		//Si el token existe, intenta decodificarlo
		const decodeToken = decode(token);

		//Si es correcto devuelve el callback con el token decodificado como parametro
		if (decodeToken) {
			callback(req, res, decodeToken);
		} else {
			res.status(404).send({ message: "Error" });
		}
	};
}
