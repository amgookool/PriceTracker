import TanstackRouterDevTool from '@/components/TanstackRouterDevTool';
import { Toaster } from '@/components/ui/sonner';
import { createRootRoute, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
	component: () => (
		<>
			<Toaster position="bottom-right" expand={true} richColors />
			<Outlet />
			<TanstackRouterDevTool />
		</>
	),
});
