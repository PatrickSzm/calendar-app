import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

interface JwtPayload {
  userId: number;
  email: string;
  twoFactorEnabled: boolean;
}

// Type guard for JwtPayload
function isJwtPayload(obj: any): obj is JwtPayload {
  return obj && typeof obj === "object" && "userId" in obj;
}

async function authenticate(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (isJwtPayload(decoded)) return decoded;
  return null;
}

export async function GET(req: NextRequest) {
  const user = await authenticate(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const filter = url.searchParams.get("filter");
  const sort = url.searchParams.get("sort");

  const events = await prisma.event.findMany({
    where: {
      userId: user.userId,  // Only fetch events for the authenticated user
      ...(filter
        ? {
            name: {
              contains: filter,
              mode: "insensitive",
            },
          }
        : {}),
    },
    orderBy: sort === "name" ? { name: "asc" } : { date: "asc" },
    include: {
      user: true,
    },
  });

  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const user = await authenticate(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  if (!body.name || !body.date || !body.time) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  const event = await prisma.event.create({
    data: {
      name: body.name,
      date: new Date(body.date),
      time: body.time,
      userId: user.userId,  // Set userId from authenticated user
    },
  });

  return NextResponse.json(event, { status: 201 });
}
