import { Link, createLazyFileRoute } from "@tanstack/react-router";
import NavBar from "@/components/Navigation/NavBar";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <div className="flex min-h-screen w-full flex-col">
        <NavBar />
        <Link to="/login">Go to Login</Link>
      </div>
    </>
  );
}
