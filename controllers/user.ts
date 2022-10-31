import { User, userCollection } from "../models/user";
import { orderCollection } from "../models/orders";

//CREA UN NUEVO USUARIO EN LA DB
export async function createUser(email: string): Promise<any> {
	const newUser = new User();
	newUser.email = email;
	const userPush = await userCollection.create(newUser);

	return userPush;
}

//DEVUELVE LA DATA DE UN USUARIO A PARTIR DE SU ID
export async function getUserData(userId: string) {
	const userData = await userCollection.findById(userId);
	delete userData.id;
	return userData;
}

//RECIBE USERID Y ACTUALIZA CON NUEVA DATA
export async function updateUserData(userId: string, newUserData: any) {
	const user = await userCollection.findById(userId);
	const { email, name, address } = newUserData;
	user.email = email ? email : user.email;
	if (name) {
		user.name = name;
	}
	if (address) {
		user.address = address;
	}

	const updateUser = await userCollection.update(user);

	return true;
}

//DEVUELVE LAS ORDERS DE UN USUARIO
export async function getMyOrders(userId) {
	const orders = await orderCollection.whereEqualTo("userId", userId).find();
	if (orders.length == 0) {
		console.log("hola");

		return false;
	}
	console.log(orders.length);

	const ordersWithStatus = [];

	orders.map((order) => {
		ordersWithStatus.push({ data: order.data, status: order.status });
	});

	return ordersWithStatus;
}
