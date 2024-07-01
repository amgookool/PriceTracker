import type { ApiRoutes } from '@server/app';
import type { InferResponseType } from 'hono/client';
import { hc } from 'hono/client';
import { addNewProductType } from './forms';

const apiClient = hc<ApiRoutes>('/');

const api = apiClient.api;

export class AuthorizationApi {
	async login(creds: { username: string; password: string }) {
		type ResType = InferResponseType<typeof api.auth.login.$post>;
		const response = await api.auth.login.$post({
			json: creds,
		});
		if (response.ok) {
			const res = await response.json();

			return res as ResType;
		} else {
			if (response.status === 401) {
				throw new Error('Invalid username or password');
			} else throw new Error('An error occurred');
		}
	}
	async logout() {
		type ResType = InferResponseType<typeof api.auth.logout.$post>;
		const response = await api.auth.logout.$post();
		if (response.ok) {
			const res = await response.json();
			console.log(res);
			return res as ResType;
		} else {
			if (response.status === 401) {
				throw new Error('Invalid username or password');
			} else throw new Error('An error occurred');
		}
	}
	async verifyAccessToken() {
		type ResType = InferResponseType<typeof api.auth.validate_access_token.$post>;
		const response = await api.auth.validate_access_token.$post();
		if (response.ok) {
			const res = await response.json();
			return res as ResType;
		} else {
			if (response.status === 401) {
				throw new Error('Invalid access token');
			} else throw new Error('An error occurred');
		}
	}
}

export class UsersApi {
	async getAllUsersApi() {
		type ResType = InferResponseType<typeof api.users.$get>;
		const response = await api.users.$get();
		if (response.ok) {
			const res = await response.json();
			return res as ResType;
		} else {
			if (response.status === 401) {
				throw new Error('Invalid username or password');
			} else throw new Error('An error occurred');
		}
	}
}

export class ProductsApi {
	async getAllUsersProductsApi() {
		type ResType = InferResponseType<typeof api.products.$get>;
		const response = await api.products.$get();
		if (response.ok) {
			const res = await response.json();
			return res as ResType;
		} else {
			if (response.status === 401) {
				throw new Error('Invalid username or password');
			} else throw new Error('An error occurred');
		}
	}
	async addProductApi(product: addNewProductType) {
		type ProductsResType = InferResponseType<typeof api.products.$post>;
		type SchedulesResType = InferResponseType<typeof api.schedules.$post>;

		const response = await api.products.$post({
			json: {
				name: product.name,
				website: product.website,
				desired_price: product.desired_price,
				product_url: product.product_url,
				user_id: product.user_id,
				description: product.description,
				is_favorite: product.is_favorite,
			},
		});
		if (response.ok) {
			const res = (await response.json()) as ProductsResType;
			const response2 = await api.schedules.$post({
				json: {
					user_id: product.user_id,
					last_scraped_at: null,
					job_name: res.name,
					product_id: res.product_id,
					scrape_interval: product.scrape_interval,
				},
			});
			if (response2.ok) {
				const res2 = (await response2.json()) as SchedulesResType;
				return {
					product: res,
					schedule: res2,
				};
			} else throw new Error("An error occured adding product's schedule");
		} else {
			throw new Error('An error occurred adding product');
		}
	}
}

export class SchedulesApi {}
