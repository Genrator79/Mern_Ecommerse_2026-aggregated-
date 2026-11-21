import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_ecommerce_jwt_secret_key_2026";

export type JwtPayload = {
  id: string;
  email: string;
  role: "user" | "admin";
};

export function signJwtToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyJwtToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
