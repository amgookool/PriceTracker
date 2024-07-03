import {
	addNewProduct,
	getProductByProductId,
	getScheduleByScheduleIdAndUserId,
	getSchedulesByUserId,
	getUsersFavoriteProducts,
	getUsersProducts,
	updateProduct,
	getAllSchedules,
} from '@server/services/application.services';
import { decodeToken, login, verifyToken } from '@server/services/authentication.services';
import { createUser, deleteUser, getUserById, getUsers, migrateUser, updateUser } from '@server/services/users.services';

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

export const ApplicationService = {
	addNewProduct,
	updateProduct,
	getUsersProducts,
	getUsersFavoriteProducts,
	getProductByProductId,
	getScheduleByScheduleIdAndUserId,
	getSchedulesByUserId,
	getAllSchedules,
};
