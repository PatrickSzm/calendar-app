import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyPassword, generateToken } from "../../../../lib/auth";
import speakeasy from "speakeasy";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, password, twoFactorToken } = await req.json();

    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    if (user.twoFactorEnabled) {
      if (!twoFactorToken) {
        return NextResponse.json({ message: "Two-factor token required", userId: user.id }, { status: 401 });
      }
      if (!user.twoFactorSecret) {
        return NextResponse.json({ message: "Two-factor secret missing on user" }, { status: 500 });
      }

      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: "base32",
        token: twoFactorToken,
      });

      if (!verified) {
        return NextResponse.json({ message: "Invalid two-factor token" }, { status: 401 });
      }
    }

    if (!user.email) {
      return NextResponse.json({ message: "User email missing" }, { status: 500 });
    }

    const jwtUser = {
      id: user.id,
      email: user.email,
      twoFactorEnabled: user.twoFactorEnabled ?? false,
    };

    const token = generateToken(jwtUser);
    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
