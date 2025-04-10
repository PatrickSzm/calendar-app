// tests/api/events.test.ts
import { GET as getAllEvents, POST as createEvent } from '@/app/api/events/route';
import { PUT as updateEvent, DELETE as deleteEvent, PATCH as patchEvent } from '@/app/api/events/[id]/route';
import { NextRequest } from 'next/server';

// Mock the in-memory events array
let mockEvents = [
  { id: 1, name: "Concert Armin Van Buuren", date: "2025-04-10", time: "20:00" },
  { id: 2, name: "Hackathon AI", date: "2025-05-20", time: "09:30" },
  { id: 3, name: "EDM Festival", date: "2025-06-15", time: "18:00" },
];

// Mock the modules
jest.mock('@/app/api/events/route', () => {
    const original = jest.requireActual('@/app/api/events/route');
    
    // Initialize mockEvents here
    let mockEvents = [
      { id: 1, name: "Concert Armin Van Buuren", date: "2025-04-10", time: "20:00" },
      { id: 2, name: "Hackathon AI", date: "2025-05-20", time: "09:30" },
      { id: 3, name: "EDM Festival", date: "2025-06-15", time: "18:00" },
    ];
  
    return {
      ...original,
      events: mockEvents,
    };
  });
  
  jest.mock('@/app/api/events/[id]/route', () => {
    const original = jest.requireActual('@/app/api/events/[id]/route');
  
    // Initialize mockEvents here as well
    let mockEvents = [
      { id: 1, name: "Concert Armin Van Buuren", date: "2025-04-10", time: "20:00" },
      { id: 2, name: "Hackathon AI", date: "2025-05-20", time: "09:30" },
      { id: 3, name: "EDM Festival", date: "2025-06-15", time: "18:00" },
    ];
  
    return {
      ...original,
      events: mockEvents,
    };
  });

describe('Events API', () => {
  beforeEach(() => {
    // Reset mock events before each test
    mockEvents = [
      { id: 1, name: "Concert Armin Van Buuren", date: "2025-04-10", time: "20:00" },
      { id: 2, name: "Hackathon AI", date: "2025-05-20", time: "09:30" },
      { id: 3, name: "EDM Festival", date: "2025-06-15", time: "18:00" },
    ];
  });

  describe('GET /api/events', () => {
    it('should return all events', async () => {
      const req = new Request('http://localhost/api/events');
      const response = await getAllEvents(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockEvents);
    });

    it('should filter events by name', async () => {
      const req = new Request('http://localhost/api/events?filter=concert');
      const response = await getAllEvents(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.length).toBe(1);
      expect(data[0].name).toContain('Concert');
    });

    it('should sort events by date', async () => {
      const req = new Request('http://localhost/api/events?sort=date');
      const response = await getAllEvents(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(new Date(data[0].date).getTime()).toBeLessThanOrEqual(new Date(data[1].date).getTime());
      expect(new Date(data[1].date).getTime()).toBeLessThanOrEqual(new Date(data[2].date).getTime());
    });

    it('should sort events by name', async () => {
      const req = new Request('http://localhost/api/events?sort=name');
      const response = await getAllEvents(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data[0].name.localeCompare(data[1].name)).toBeLessThanOrEqual(0);
      expect(data[1].name.localeCompare(data[2].name)).toBeLessThanOrEqual(0);
    });
  });

  describe('POST /api/events', () => {
    it('should create a new event', async () => {
      const newEvent = {
        name: "New Event",
        date: "2025-07-01",
        time: "12:00"
      };

      const req = new Request('http://localhost/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });

      const response = await createEvent(req);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.id).toBe(4);
      expect(data.name).toBe(newEvent.name);
      expect(mockEvents.length).toBe(3);
    });

    it('should return 400 if required fields are missing', async () => {
      const invalidEvent = {
        name: "Incomplete Event",
        // Missing date and time
      };

      const req = new Request('http://localhost/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidEvent),
      });

      const response = await createEvent(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("All fields required");
    });
  });

  describe('PUT /api/events/[id]', () => {
    it('should update an existing event', async () => {
      const updatedEvent = {
        name: "Updated Concert",
        date: "2025-04-11",
        time: "21:00"
      };

      const req = new NextRequest('http://localhost/api/events/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEvent),
      });

      const response = await updateEvent(req, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe(1);
      expect(data.name).toBe(updatedEvent.name);
      expect(data.date).toBe(updatedEvent.date);
      expect(data.time).toBe(updatedEvent.time);
    });

    it('should return 400 if required fields are missing', async () => {
      const invalidUpdate = {
        name: "Incomplete Update",
        // Missing date and time
      };

      const req = new NextRequest('http://localhost/api/events/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidUpdate),
      });

      const response = await updateEvent(req, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("All fields required");
    });

    it('should return 404 if event not found', async () => {
      const req = new NextRequest('http://localhost/api/events/999', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: "Non-existent",
          date: "2025-01-01",
          time: "00:00"
        }),
      });

      const response = await updateEvent(req, { params: { id: '999' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Event not found");
    });
  });

  describe('PATCH /api/events/[id]', () => {
    it('should partially update an event', async () => {
      const partialUpdate = {
        name: "Patched Concert Name",
      };

      const req = new NextRequest('http://localhost/api/events/1', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partialUpdate),
      });

      const response = await patchEvent(req, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe(1);
      expect(data.name).toBe(partialUpdate.name);
      // Other fields should remain unchanged
      expect(data.date).toBe("2025-04-11");
      expect(data.time).toBe("21:00");
    });

    it('should return 404 if event not found', async () => {
      const req = new NextRequest('http://localhost/api/events/999', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: "Non-existent" }),
      });

      const response = await patchEvent(req, { params: { id: '999' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Event not found");
    });
  });

  describe('DELETE /api/events/[id]', () => {
    it('should delete an existing event', async () => {
      const initialLength = mockEvents.length;
      const req = new Request('http://localhost/api/events/1', {
        method: 'DELETE',
      });

      const response = await deleteEvent(req, { params: { id: '1' } });

      expect(response.status).toBe(204);
      expect(mockEvents.length).toBe(initialLength);
    });

    it('should return 404 if event not found', async () => {
      const req = new Request('http://localhost/api/events/999', {
        method: 'DELETE',
      });

      const response = await deleteEvent(req, { params: { id: '999' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Event not found");
    });
  });
});