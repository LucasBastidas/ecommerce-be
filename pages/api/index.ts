import { NextApiRequest, NextApiResponse } from "next";
import { useFireorm, firestore } from "../../lib/firebase";

export default async function (req: NextApiRequest, res: NextApiResponse) {
	console.log(firestore.terminate);

	res.send("Iniciando");
}
