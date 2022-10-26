import * as admin from "firebase-admin";
import * as fireorm from "fireorm";

var serviceAccount = JSON.parse(process.env.FIREBASE_API_KEY);

if (admin.apps.length == 0) {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
	});
}

const firestore = admin.firestore();
const useFireorm = fireorm.initialize(firestore);

export { useFireorm, firestore };
