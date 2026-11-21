import { create } from "zustand";
import type { AppUser } from "@/lib/types";
import { loginUser, registerUser, logoutUser } from "./api";
import type { LoginInput, RegisterInput } from "./types";

type AuthStatus = "idle" | "loading" | "ready" | "error";

type AuthStore = {
  status: AuthStatus;
  isBootstrapped: boolean;
  user: AppUser | null;
  token: string | null;
  error: string | null;

  setLoading: () => void;
  setUser: (user: AppUser | null, token?: string | null) => void;
  setError: (message: string) => void;
  clearAuth: () => void;
  login: (input: LoginInput) => Promise<AppUser>;
  register: (input: RegisterInput) => Promise<AppUser>;
  logout: () => Promise<void>;
};

const TOKEN_KEY = "token";

export const useAuthStore = create<AuthStore>((set) => ({
  status: "idle",
  isBootstrapped: false,
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null,
  error: null,

  setLoading: () =>
    set({
      status: "loading",
      error: null,
    }),

  setUser: (user, token) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
    set((state) => ({
      status: "ready",
      isBootstrapped: true,
      user,
      token: token !== undefined ? token : state.token,
      error: null,
    }));
  },

  setError: (message) =>
    set({
      status: "error",
      isBootstrapped: true,
      error: message,
    }),

  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    set({
      status: "ready",
      isBootstrapped: true,
      user: null,
      token: null,
      error: null,
    });
  },

  login: async (input: LoginInput) => {
    set({ status: "loading", error: null });
    try {
      const data = await loginUser(input);
      localStorage.setItem(TOKEN_KEY, data.token);
      set({
        status: "ready",
        isBootstrapped: true,
        user: data.user,
        token: data.token,
        error: null,
      });
      return data.user;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed";
      set({ status: "error", error: msg });
      throw err;
    }
  },

  register: async (input: RegisterInput) => {
    set({ status: "loading", error: null });
    try {
      const data = await registerUser(input);
      localStorage.setItem(TOKEN_KEY, data.token);
      set({
        status: "ready",
        isBootstrapped: true,
        user: data.user,
        token: data.token,
        error: null,
      });
      return data.user;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      set({ status: "error", error: msg });
      throw err;
    }
  },

  logout: async () => {
    try {
      await logoutUser();
    } catch {
      // ignore
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      set({
        status: "ready",
        isBootstrapped: true,
        user: null,
        token: null,
        error: null,
      });
    }
  },
}));

// Compatibility hooks so existing components can continue using useAuth() and useUser()
export function useAuth() {
  const { user, token, isBootstrapped, logout } = useAuthStore();
  const isSignedIn = Boolean(user && token);

  return {
    isLoaded: isBootstrapped,
    isSignedIn,
    userId: user?.id,
    getToken: async () => token,
    signOut: logout,
  };
}

export function useUser() {
  const user = useAuthStore((s) => s.user);
  return {
    isLoaded: true,
    isSignedIn: Boolean(user),
    user: user
      ? {
          id: user.id,
          fullName: user.name,
          primaryEmailAddress: { emailAddress: user.email },
          emailAddresses: [{ emailAddress: user.email }],
        }
      : null,
  };
}
