import type { AppUser } from "@/lib/types";

export type AuthResponse = {
  token: string;
  user: AppUser;
};

export type MeResponse = {
  user: AppUser;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};
