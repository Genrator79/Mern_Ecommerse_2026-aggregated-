import { useAuthStore } from "./store";
import { useEffect } from "react";
import { getMe } from "./api";
import { setApiTokenGetter } from "@/lib/api";

export function useBootstrapAuth() {
  const { setUser, clearAuth, setError, setLoading } = useAuthStore();

  useEffect(() => {
    setApiTokenGetter(async () => {
      const token = localStorage.getItem("token");
      return token ?? null;
    });
  }, []);

  useEffect(() => {
    async function run() {
      const token = localStorage.getItem("token");
      if (!token) {
        clearAuth();
        return;
      }

      try {
        setLoading();
        const me = await getMe();
        setUser(me?.user, token);
      } catch {
        clearAuth();
        setError("Session expired. Please log in again.");
      }
    }

    void run();
  }, [clearAuth, setError, setLoading, setUser]);
}
