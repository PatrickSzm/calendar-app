import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import speakeasy from "speakeasy";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userId, token } = await req.json();

    if (typeof userId !== "number" || typeof token !== "string") {
      return NextResponse.json({ message: "User ID and token are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.twoFactorSecret) {
      return NextResponse.json({ message: "2FA not setup" }, { status: 400 });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
    });

    if (verified) {
      await prisma.user.update({
        where: { id: userId },
        data: { twoFactorEnabled: true },
      });
      return NextResponse.json({ message: "2FA enabled" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Invalid 2FA token" }, { status: 401 });
    }
  } catch (error) {
    console.error("Verify 2FA error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
