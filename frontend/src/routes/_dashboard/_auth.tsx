import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import NavBreadCrumb from "@/components/Navigation/NavBreadCrumb";

export const Route = createFileRoute("/_dashboard/_auth")({
  component: Auth,
  beforeLoad: ({ context }) => {
    const authUser = localStorage.getItem("auth");
    if (authUser) {
      const user = JSON.parse(authUser);
      context.login(user.username, user.userId);
    } else {
      throw redirect({ to: "/login" });
    }
  },
});

function Auth() {
  return (
    <div className="container pt-4 space-y-5">
      <NavBreadCrumb />
      <Outlet />
    </div>
  );
}
