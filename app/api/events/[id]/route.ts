// app/api/events/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const id = parseInt(context.params.id);

  const body = await req.json();

  if (!body.name || !body.date || !body.time || !body.userId) {
    return new Response(JSON.stringify({ error: "All fields required" }), { status: 400 });
  }

  try {
    const event = await prisma.event.update({
      where: { id },
      data: {
        name: body.name,
        date: new Date(body.date),
        time: body.time,
        userId: body.userId,
      },
    });

    return Response.json(event);
  } catch (err) {
    return new Response(JSON.stringify({ error: "Event not found" }), { status: 404 });
  }
}

export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  const id = parseInt(context.params.id);

  const body = await req.json();

  try {
    const event = await prisma.event.update({
      where: { id },
      data: {
        name: body.name ?? undefined,
        date: body.date ? new Date(body.date) : undefined,
        time: body.time ?? undefined,
        userId: body.userId ?? undefined,
      },
    });

    return Response.json(event);
  } catch (err) {
    return new Response(JSON.stringify({ error: "Event not found" }), { status: 404 });
  }
}

export async function DELETE(_: Request, context: { params: { id: string } }) {
  const id = parseInt(context.params.id);


  try {
    await prisma.event.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Event not found" }), { status: 404 });
  }
}
