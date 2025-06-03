import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

interface JwtPayload {
  userId: number;
  email: string;
  twoFactorEnabled: boolean;
}

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

export async function PUT(req: NextRequest, context: any) {
  const user = await authenticate(req);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const id = parseInt(context.params.id);
  const body = await req.json();

  if (!body.name || !body.date || !body.time) {
    return new Response(JSON.stringify({ error: "All fields required" }), { status: 400 });
  }

  // Make sure the event belongs to the logged-in user
  const existingEvent = await prisma.event.findUnique({ where: { id } });
  if (!existingEvent || existingEvent.userId !== user.userId) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const event = await prisma.event.update({
      where: { id },
      data: {
        name: body.name,
        date: new Date(body.date),
        time: body.time,
      },
    });

    return NextResponse.json(event);
  } catch (err) {
    return new Response(JSON.stringify({ error: "Event not found" }), { status: 404 });
  }
}

export async function PATCH(req: NextRequest, context: any) {
  const user = await authenticate(req);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const id = parseInt(context.params.id);
  const body = await req.json();

  const existingEvent = await prisma.event.findUnique({ where: { id } });
  if (!existingEvent || existingEvent.userId !== user.userId) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const event = await prisma.event.update({
      where: { id },
      data: {
        name: body.name ?? undefined,
        date: body.date ? new Date(body.date) : undefined,
        time: body.time ?? undefined,
      },
    });

    return NextResponse.json(event);
  } catch (err) {
    return new Response(JSON.stringify({ error: "Event not found" }), { status: 404 });
  }
}

export async function DELETE(req: NextRequest, context: any) {
  const user = await authenticate(req);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const id = parseInt(context.params.id);

  const existingEvent = await prisma.event.findUnique({ where: { id } });
  if (!existingEvent || existingEvent.userId !== user.userId) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    await prisma.event.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Event not found" }), { status: 404 });
  }
}
