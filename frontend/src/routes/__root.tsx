import { createRootRoute,Outlet } from "@tanstack/react-router";
import TanstackRouterDevTool from "@/components/TanstackRouterDevTool";

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanstackRouterDevTool />
    </>
  ),
});
