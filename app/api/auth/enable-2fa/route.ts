import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import speakeasy from "speakeasy";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (typeof userId !== "number") {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    const secret = speakeasy.generateSecret();

    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret.base32, twoFactorEnabled: false },
    });

    return NextResponse.json({ secret: secret.base32, otpauth_url: secret.otpauth_url }, { status: 200 });
  } catch (error) {
    console.error("Enable 2FA error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
