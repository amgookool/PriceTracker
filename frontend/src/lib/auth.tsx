import * as React from "react";
export interface AuthContextType {
  username: string | null;
  userId: number | null;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  login: (username: string, userId: number) => Promise<void>;
}

export const AuthorizationContext = React.createContext<AuthContextType | null>(
  null
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = React.useState<string | null>(null);
  const [userId, setUserId] = React.useState<number | null>(null);
  const isAuthenticated = !!username && !!userId;



  async function logout() {
    setUsername(null);
    setUserId(null);
    localStorage.removeItem("auth");
  }

  async function login(username: string, userId: number) {
    setUsername(username);
    setUserId(userId);
  }

  const value = {
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
