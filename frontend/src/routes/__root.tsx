import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import TanstackRouterDevTool from "@/components/TanstackRouterDevTool";
import { Toaster } from "@/components/ui/sonner";
import { AuthContextType } from "@/lib/auth";

export const Route = createRootRouteWithContext<AuthContextType>()({
  component: () => (
    <>
      <Toaster position="top-right" expand={true} richColors  />
      <Outlet />
      <TanstackRouterDevTool />
    </>
  ),
});
