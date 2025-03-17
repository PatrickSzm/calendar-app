// app/api/events/route.ts
import { NextResponse } from 'next/server';

// Sample data to return as response (a hardcoded list of events)
const events = [
  { id: 1, name: 'Event 1', date: '2025-03-11' },
  { id: 2, name: 'Event 2', date: '2025-03-12' },
  { id: 3, name: 'Event 3', date: '2025-03-13' }
];

// Handle GET requests (fetch all events)
export async function GET() {
  return NextResponse.json(events); // Return the events as JSON response
}
