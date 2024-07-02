import {
	addProduct,
	deleteProduct,
	getProductByProductId,
	getProducts,
	getProductsByUserId,
	getProductsWithPriceHistory,
} from '@server/services/products.services';
import { createSchedule, deleteSchedule, getAllSchedules, getSchedulesByUserId } from '@server/services/schedules.services';
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
	getProducts,
	getProductsByUserId,
	getProductByProductId,
	deleteProduct,
	getProductsWithPriceHistory,
};

export const ScheduleService = {
	createSchedule,
	deleteSchedule,
	getAllSchedules,
	getSchedulesByUserId,
};
