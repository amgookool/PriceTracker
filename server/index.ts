import app from "./app";

const server = Bun.serve({
  port: process.env.PORT || 2500,
  hostname: "0.0.0.0",
  fetch: app.fetch,
});

console.log(`Server running on port:${server.port}`);
