import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { readStorage, writeStorage } from "../utils/storage";

const AuthContext = createContext(null);

const ADMIN = {
  id: "admin-1",
  name: "Administrator",
  email: "admin@example.com",
  password: "Admin123!",
  role: "admin",
};

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() =>
    readStorage("shop_users", [ADMIN])
  );

  const [user, setUser] = useState(() =>
    readStorage("shop_current_user", null)
  );

  useEffect(() => {
    writeStorage("shop_users", users);
  }, [users]);

  useEffect(() => {
    if (user) {
      writeStorage("shop_current_user", user);
    } else {
      localStorage.removeItem("shop_current_user");
    }
  }, [user]);

  function register({ name, email, password }) {
    const normalizedEmail = email.trim().toLowerCase();

    if (
      users.some(
        (item) => item.email.toLowerCase() === normalizedEmail
      )
    ) {
      throw new Error("An account with this email already exists.");
    }

    const newUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: "customer",
    };

    setUsers((previous) => [...previous, newUser]);

    const safeUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    setUser(safeUser);
    return safeUser;
  }

  function login(email, password) {
    const normalizedEmail = email.trim().toLowerCase();

    const found = users.find(
      (item) =>
        item.email.toLowerCase() === normalizedEmail &&
        item.password === password
    );

    if (!found) {
      throw new Error("Invalid email or password.");
    }

    const safeUser = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
    };

    setUser(safeUser);
    return safeUser;
  }

  function logout() {
    setUser(null);
  }

  function updateProfile(updates) {
    if (!user) {
      throw new Error("Please sign in first.");
    }

    const updated = {
      ...user,
      name: updates.name.trim(),
    };

    setUsers((previous) =>
      previous.map((item) =>
        item.id === user.id ? { ...item, ...updated } : item
      )
    );

    setUser(updated);
    return updated;
  }

  return (
    <AuthContext.Provider
      value={{ user, users, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
