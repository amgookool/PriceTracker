import { Link, createLazyFileRoute } from "@tanstack/react-router";
import NavBar from "@/components/NavBar";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <Link to="/login">Go to Login</Link>
    </>
  );
}
