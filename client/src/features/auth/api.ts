import { apiGet, apiPost } from "@/lib/api";
import type { AuthResponse, LoginInput, MeResponse, RegisterInput } from "./types";

export function registerUser(body: RegisterInput) {
  return apiPost<AuthResponse, RegisterInput>("/auth/register", body);
}

export function loginUser(body: LoginInput) {
  return apiPost<AuthResponse, LoginInput>("/auth/login", body);
}

export function getMe() {
  return apiGet<MeResponse>("/auth/me");
}

export function logoutUser() {
  return apiPost<{ message: string }>("/auth/logout");
}
