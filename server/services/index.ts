import {
	addPriceHistory,
	addProduct,
	deleteProduct,
	getProductByProductId,
	getProducts,
	getProductsByUserId,
	getProductsWithPriceHistory,
	updateProduct,
} from '@server/services/products.services';
import {
	createSchedule,
	deleteSchedule,
	getAllSchedules,
	getSchedulesByUserId,
	updateSchedule,
} from '@server/services/schedules.services';
import { createUser, deleteUser, getUserById, getUsers, migrateUser, updateUser } from '@server/services/users.services';

import { decodeToken, login, verifyToken } from '@server/services/authentication.services';

export const AuthenticationService = {
	decodeToken,
	login,
	verifyToken,
};

export const UserService = {
	getUsers,
	getUserById,
	createUser,
	updateUser,
	deleteUser,
	migrateUser,
};

export const ProductService = {
	addProduct,
	addPriceHistory,
	getProducts,
	getProductsByUserId,
	getProductByProductId,
	deleteProduct,
	updateProduct,
	getProductsWithPriceHistory,
};

export const ScheduleService = {
	createSchedule,
	deleteSchedule,
	getAllSchedules,
	getSchedulesByUserId,
	updateSchedule,
};
