import * as React from "react";

export interface AuthContext {
  isAuthenticated: boolean;
  username: string | null;
  userId: number | null;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContext | null>(null);

const cookieKey = "access_token";

