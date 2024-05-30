import { Link, createLazyFileRoute } from "@tanstack/react-router";


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
