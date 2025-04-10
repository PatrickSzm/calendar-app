import { NextRequest } from "next/server";

let events = [
  { id: 1, name: "Concert Armin Van Buuren", date: "2025-04-10", time: "20:00" },
  { id: 2, name: "Hackathon AI", date: "2025-05-20", time: "09:30" },
  { id: 3, name: "EDM Festival", date: "2025-06-15", time: "18:00" },
];

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const body = await req.json();

  if (!body.name || !body.date || !body.time) {
    return new Response(JSON.stringify({ error: "All fields required" }), { status: 400 });
  }

  const index = events.findIndex((e) => e.id === id);
  if (index === -1) {
    return new Response(JSON.stringify({ error: "Event not found" }), { status: 404 });
  }

  events[index] = { id, ...body };

  return new Response(JSON.stringify(events[index]), { status: 200 });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    const id = parseInt(params.id);
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) {
      return new Response(JSON.stringify({ error: "Event not found" }), { status: 404 });
    }
  
    const deletedEvent = events.splice(index, 1); // You can optionally return this if needed

    return new Response(null, { status: 204 });
  }
  

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const body = await req.json();

  // Find the event by ID
  const event = events.find(e => e.id === id);
  if (!event) {
    return new Response(JSON.stringify({ error: "Event not found" }), { status: 404 });
  }

  // Validate the body content (only update the fields that exist)
  if (body.name) event.name = body.name;
  if (body.date) event.date = body.date;
  if (body.time) event.time = body.time;

  return new Response(JSON.stringify(event), { status: 200 });
}


