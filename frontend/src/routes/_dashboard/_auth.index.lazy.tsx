
import { Link, createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_dashboard/_auth/")({
  component: Index,
});

function Index() {
  return (
    <>
      <div className="container">
        <Link to="/login">Go to Login</Link>
      </div>
    </>
  );
}
