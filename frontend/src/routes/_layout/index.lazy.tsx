import { Link, createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_layout/")({
  component: Index,
});

function Index() {
  return (
    <>
      <div className="flex min-h-screen w-full flex-col">
        <Link to="/login">Go to Login</Link>
      </div>
    </>
  );
}
