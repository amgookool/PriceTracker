import type { ApiRoutes } from '@server/app';
import { createProductModel } from '@Types/product.types';
import { hc } from 'hono/client';
import { z } from 'zod';

const apiClient = hc<ApiRoutes>('/');

const api = apiClient.api;

export const loginUserApi = async (creds: { username: string; password: string }) => {
	const response = await api.auth.login.$post({
		json: creds,
	});
	if (response.ok) {
		const res = await response.json();

		return res;
	} else {
		if (response.status === 401) {
			throw new Error('Invalid username or password');
		} else throw new Error('An error occurred');
	}
};

export const logoutUserApi = async () => {
	const response = await api.auth.logout.$post();
	if (response.ok) {
		const res = await response.json();
		console.log(res);
		return res;
	} else {
		if (response.status === 401) {
			throw new Error('Invalid username or password');
		} else throw new Error('An error occurred');
	}
};

export const getAllUsersApi = async () => {
	const response = await api.users.$get();
	if (response.ok) {
		const res = await response.json();
		return res;
	} else {
		if (response.status === 401) {
			throw new Error('Invalid username or password');
		} else throw new Error('An error occurred');
	}
};

export const getAllUsersProductsApi = async () => {
	const response = await api.products.$get();
	if (response.ok) {
		const res = await response.json();
		return res;
	} else {
		if (response.status === 401) {
			throw new Error('Invalid username or password');
		} else throw new Error('An error occurred');
	}
};

const addNewProduct = createProductModel.extend({
	scrape_interval: z.string().trim(),
});

export type addNewProductType = z.infer<typeof addNewProduct>;

export const addProductApi = async (product: addNewProductType) => {
	console.log('Adding product');
	console.log('Product:', product);
	return {
		ok: true,
		message: 'Successfully added product',
	};
};

export default api;
