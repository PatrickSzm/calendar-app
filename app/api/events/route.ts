// app/api/events/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const filter = url.searchParams.get("filter");
  const sort = url.searchParams.get("sort");

  const events = await prisma.event.findMany({
    where: filter
      ? {
          name: {
            contains: filter,
            mode: "insensitive",
          },
        }
      : {},
    orderBy: sort === "name" ? { name: "asc" } : { date: "asc" },
    include: {
      user: true,
    },
  });

  return Response.json(events);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.name || !body.date || !body.time || !body.userId) {
    return new Response(JSON.stringify({ error: "All fields required" }), { status: 400 });
  }

  const event = await prisma.event.create({
    data: {
      name: body.name,
      date: new Date(body.date),
      time: body.time,
      userId: body.userId,
    },
  });

  return new Response(JSON.stringify(event), { status: 201 });
}
