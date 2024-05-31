import * as React from "react";
import { useCookies } from "react-cookie";

export interface AuthContextType {
  accessToken: string | null;
  username: string | null;
  userId: number | null;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  login: (username: string, userId: number) => Promise<void>;
}

export const AuthorizationContext = React.createContext<AuthContextType | null>(null);



export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [cookies, setCookie] = useCookies(["access_token"]);
  const [username, setUsername] = React.useState<string | null>(null);
  const [userId, setUserId] = React.useState<number | null>(null);
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const isAuthenticated = !!username && !!userId;

  React.useEffect(() => {
    if (cookies.access_token) {
      setAccessToken(cookies.access_token);
    }
  }, [cookies.access_token]);

  async function logout() {
    setCookie("access_token", null, { path: "/" });
    setUsername(null);
    setUserId(null);
    setAccessToken(null);
  }

  async function login(username: string, userId: number) {
    if (cookies.access_token) {
      setAccessToken(cookies.access_token);
    }
    setUsername(username);
    setUserId(userId);
  }

  const value = {
    accessToken,
    username,
    userId,
    isAuthenticated,
    logout,
    login,
  };

  return (
    <AuthorizationContext.Provider value={value}>
      {children}
    </AuthorizationContext.Provider>
  );
}
