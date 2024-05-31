import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/_auth")({
  beforeLoad: async ({ context, location }) => {
    if (!context.isAuthenticated){
      throw redirect({to: '/login', from: location.pathname})
    }
  },
  component: Auth,
});

function Auth() {
  return (
    <>
      <Outlet />
    </>
  );
}
