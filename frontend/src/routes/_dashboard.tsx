import NavBar from "@/components/Navigation/NavBar";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard")({
  component: LayoutComponent,
});

function LayoutComponent() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <NavBar />
      <Outlet />
    </div>
  );
}
