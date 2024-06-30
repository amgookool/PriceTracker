import NavBreadCrumb from '@/components/Navigation/NavBreadCrumb';
import { AuthorizationApi } from '@/lib/api';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

const authApiService = new AuthorizationApi();

export const Route = createFileRoute('/_dashboard/_auth')({
	component: Auth,
	beforeLoad: async () => {
		let accessTokenVerification = false;
		let user = null;
		try {
			const response = await authApiService.verifyAccessToken();
			if (response) {
				accessTokenVerification = true;
			} else throw new Error('Invalid access token');
			user = {
				username: response.username,
				userId: response.userId,
				email: response.email,
				role: response.role,
			};
		} catch (error) {
			const err = error as Error;
			console.error(err.message);
			localStorage.clear();
			throw redirect({ to: '/login' });
		}

		if (accessTokenVerification) {
			localStorage.setItem('auth', JSON.stringify(user));
		}
		if (!accessTokenVerification) {
			localStorage.clear();
			throw redirect({ to: '/login' });
		}
	},
	loader: async () => {},
});

function Auth() {
	return (
		<div className="container pt-4 space-y-5">
			<NavBreadCrumb />
			<Outlet />
		</div>
	);
}
