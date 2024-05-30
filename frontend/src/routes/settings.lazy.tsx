import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/settings")({
  component: Settings,
});

function Settings() {
  return (
    <>
      <h1 className="text-2xl">Settings Page</h1>

      <h3>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt neque
        earum repellendus tempora enim suscipit fugit, veniam commodi, magnam
        repudiandae est possimus, repellat nulla voluptates ipsum. Cum aut vero
        dicta.
      </h3>
    </>
  );
}
