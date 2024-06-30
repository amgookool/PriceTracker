import NavBar from '@/components/Navigation/NavBar';
// import { AuthorizationApi } from '@/lib/api';
import { Outlet, createFileRoute } from '@tanstack/react-router';

// const authApiService = new AuthorizationApi();

export const Route = createFileRoute('/_dashboard')({
	component: LayoutComponent,
	loader: async () => {
		return null;
	},
});

function LayoutComponent() {
	return (
		<div className="flex min-h-screen w-full flex-col">
			<NavBar />
			<Outlet />
		</div>
	);
}
