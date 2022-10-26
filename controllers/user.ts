import { User, userCollection } from "../models/user";
import { orderCollection } from "../models/orders";

export async function createUser(email: string): Promise<any> {
	const newUser = new User();
	newUser.email = email;
	const userPush = await userCollection.create(newUser);

	return userPush;
}

export async function getUserData(userId: string) {
	const userData = await userCollection.findById(userId);
	delete userData.id;
	return userData;
}

export async function updateUserData(userId: string, newUserData: any) {
	const user = await userCollection.findById(userId);
	const { email, name, address } = newUserData;
	console.log(user, email, name, address);
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
