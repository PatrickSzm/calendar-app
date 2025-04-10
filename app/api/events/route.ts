import { NextResponse } from 'next/server';

let events = [
  { id: 1, name: "Concert Armin Van Buuren", date: "2025-04-10", time: "20:00" },
  { id: 2, name: "Hackathon AI", date: "2025-05-20", time: "09:30" },
  { id: 3, name: "EDM Festival", date: "2025-06-15", time: "18:00" },
];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const filter = url.searchParams.get("filter"); // Filter query parameter (by name)
  const sort = url.searchParams.get("sort"); // Sort query parameter (by date or name)

  let filteredEvents = [...events];

  // Apply filtering
  if (filter) {
    filteredEvents = filteredEvents.filter(event =>
      event.name.toLowerCase().includes(filter.toLowerCase())
    );
  }

  // Apply sorting
  if (sort === "date") {
    filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } else if (sort === "name") {
    filteredEvents.sort((a, b) => a.name.localeCompare(b.name));
  }

  return NextResponse.json(filteredEvents);
}

export async function POST(req: Request) {
  const body = await req.json();
  
  if (!body.name || !body.date || !body.time) {
    return new Response(JSON.stringify({ error: "All fields required" }), { status: 400 });
  }

  const newEvent = {
    id: events.length + 1,
    ...body,
  };

  events.push(newEvent);

  return new Response(JSON.stringify(newEvent), { status: 201 });
}

