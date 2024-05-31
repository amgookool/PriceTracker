import { ThemeProvider } from "@/components/ThemeProvider";
import "@/index.css";
import { AuthProvider, type AuthContextType } from "@/lib/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import { CookiesProvider } from "react-cookie";
import ReactDOM from "react-dom/client";
// Import the generated route tree
import { useAuth } from "@/lib/utils";
import { routeTree } from "@/routeTree.gen";

// Create a new router instance
const authUser = {} as AuthContextType;
const router = createRouter({
  routeTree,
  context: authUser,
});
const queryClient = new QueryClient();

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// eslint-disable-next-line react-refresh/only-export-components
function App() {
  const authUser = useAuth();
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={authUser} />
    </QueryClientProvider>
  );
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <CookiesProvider defaultSetOptions={{ path: "/" }}>
        <ThemeProvider defaultTheme="dark" storageKey="tracker-ui-theme">
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </CookiesProvider>
    </StrictMode>
  );
}
