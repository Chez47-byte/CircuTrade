import { useState } from "react";
import { AuthContext } from "./AuthContextObject";
import { getToken } from "../utils/auth";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = getToken();
    return token ? { token } : null;
  });

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
