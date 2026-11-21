import { Router } from "express";
import bcrypt from "bcryptjs";
import { getDbUserFromReq, requireAuth } from "../../middleware/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { AppError } from "../../utils/AppError";
import { User } from "../../models/User";
import { ok } from "../../utils/envelope";
import { signJwtToken } from "../../utils/jwt";
import { requireText } from "../../utils/helpers";

export const authRouter = Router();

function getAdminEmailsSet(): Set<string> {
  const raw = process.env.ADMIN_EMAILS || "";
  return new Set(
    raw
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean),
  );
}

authRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    requireText(name, "Name is required");
    requireText(email, "Email is required");
    requireText(password, "Password is required");

    if (password.length < 6) {
      throw new AppError(400, "Password must be at least 6 characters long");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AppError(400, "Invalid email address format");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError(400, "User with this email already exists");
    }

    const adminEmails = getAdminEmailsSet();
    const role = adminEmails.has(email) ? "admin" : "user";

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      points: 0,
    });

    const token = signJwtToken({
      id: String(newUser._id),
      email: newUser.email,
      role: newUser.role,
    });

    res.status(201).json(
      ok({
        token,
        user: {
          id: String(newUser._id),
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          points: newUser.points,
        },
      }),
    );
  }),
);

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    requireText(email, "Email is required");
    requireText(password, "Password is required");

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      throw new AppError(401, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError(401, "Invalid email or password");
    }

    const adminEmails = getAdminEmailsSet();
    if (adminEmails.has(email) && user.role !== "admin") {
      user.role = "admin";
      await user.save();
    }

    const token = signJwtToken({
      id: String(user._id),
      email: user.email,
      role: user.role,
    });

    res.status(200).json(
      ok({
        token,
        user: {
          id: String(user._id),
          email: user.email,
          name: user.name,
          role: user.role,
          points: user.points,
        },
      }),
    );
  }),
);

authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const dbUser = await getDbUserFromReq(req);

    res.status(200).json(
      ok({
        user: {
          id: String(dbUser._id),
          email: dbUser.email,
          name: dbUser.name,
          role: dbUser.role,
          points: dbUser.points,
        },
      }),
    );
  }),
);

authRouter.post(
  "/logout",
  asyncHandler(async (_req, res) => {
    res.status(200).json(ok({ message: "Logged out successfully" }));
  }),
);
