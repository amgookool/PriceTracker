import { createUser, deleteUser, getUserById, getUsers, migrateUser, updateUser } from '@server/services/users.services';
import { addNewProduct, getUsersFavoriteProducts, updateProduct, getUsersProducts } from '@server/services/application.services';
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

export const ApplicationService = {
	addNewProduct,
	updateProduct,
	getUsersProducts,
	getUsersFavoriteProducts,
};
