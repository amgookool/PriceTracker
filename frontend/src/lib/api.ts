import type { ApiRoutes } from "@server/app";
import { hc } from "hono/client";

const apiClient = hc<ApiRoutes>("/");

const api = apiClient.api;
export default api;
