import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { User } from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyJwtToken } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: "user" | "admin";
  };
}

export function extractToken(req: Request): string {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError(401, "User is not logged in. Missing or invalid token");
  }
  return authHeader.split(" ")[1];
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = extractToken(req);
    const decoded = verifyJwtToken(token);
    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(401, "Invalid or expired token"));
  }
}

export async function getDbUserFromReq(req: Request) {
  const token = extractToken(req);
  let decoded;
  try {
    decoded = verifyJwtToken(token);
  } catch {
    throw new AppError(401, "Invalid or expired token");
  }

  const dbUser = await User.findById(decoded.id);
  if (!dbUser) {
    throw new AppError(404, "User is not found in the DB");
  }

  return dbUser;
}

export const requireAdmin = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const extractCurrentDbUser = await getDbUserFromReq(req);

    if (extractCurrentDbUser.role !== "admin") {
      throw new AppError(403, "Admin access only");
    }

    next();
  },
);
