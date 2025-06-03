import Image from "next/image";

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Event = {
  id: number;
  name: string;
  date: string;
  time: string;
  userId: number;
};

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState<Omit<Event, "id">>({ name: "", date: "", time: "", userId: 1 });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterDays, setFilterDays] = useState<number | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await fetch("/api/events");
    const data = await res.json();
    setEvents(data);
  };

  const handleAddEvent = async () => {
    if (!newEvent.name || !newEvent.date || !newEvent.time) {
      alert("Completează toate câmpurile!");
      return;
    }

    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    });

    if (res.ok) {
      await fetchEvents();
      setNewEvent({ name: "", date: "", time: "", userId: 1 });
    }
  };

  const handleDeleteEvent = async (id: number) => {
    await fetch(`/api/events/${id}`, { method: "DELETE" });
    await fetchEvents();
  };

  const handleEditEvent = async () => {
    if (!newEvent.name || !newEvent.date || !newEvent.time) {
      alert("Completează toate câmpurile!");
      return;
    }

    await fetch(`/api/events/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    });

    setEditingId(null);
    setNewEvent({ name: "", date: "", time: "", userId: 1 });
    await fetchEvents();
  };

  const startEditing = (event: Event) => {
    setNewEvent({ name: event.name, date: event.date, time: event.time, userId: event.userId });
    setEditingId(event.id);
  };

  const today = new Date();
  const filteredEvents = events.filter((event) => {
    if (!filterDays) return true;
    const eventDate = new Date(event.date);
    const diffInDays = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffInDays <= filterDays;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const earliestEvent = sortedEvents.reduce((earliest, event) => {
    return new Date(event.date) < new Date(earliest.date) ? event : earliest;
  }, sortedEvents[0]);

  const latestEvent = sortedEvents.reduce((latest, event) => {
    return new Date(event.date) > new Date(latest.date) ? event : latest;
  }, sortedEvents[0]);

  const totalDays = sortedEvents.reduce((sum, event) => {
    const eventDate = new Date(event.date);
    return sum + Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }, 0);

  const averageDaysUntilEvent = sortedEvents.length ? Math.round(totalDays / sortedEvents.length) : 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">🎉 Upcoming Events</h1>
        <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-center">📊 Event Statistics</h2>
          <p className="text-gray-400 text-center">📅 Average days until events: {averageDaysUntilEvent} days</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-6">
          <input
            type="text"
            placeholder="Event Name"
            value={newEvent.name}
            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
            className="w-full p-2 mb-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
          />
          <input
            type="time"
            value={newEvent.time}
            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
            className="w-full p-2 mb-2 bg-gray-700 border border-gray-600 rounded text-white"
          />
          <input
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            className="w-full p-2 mb-2 bg-gray-700 border border-gray-600 rounded text-white"
          />
          {editingId ? (
            <Button onClick={handleEditEvent} className="w-full bg-blue-600 hover:bg-blue-500">
              Save Changes
            </Button>
          ) : (
            <Button onClick={handleAddEvent} className="w-full bg-green-600 hover:bg-green-500">
              Add Event
            </Button>
          )}
        </div>

        <div className="flex gap-2 my-4">
          <input
            type="number"
            placeholder="Filter days"
            className="p-2 bg-gray-800 text-white rounded-lg w-24"
            onChange={(e) => setFilterDays(e.target.value ? parseInt(e.target.value) : null)}
          />
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
            onClick={() => setFilterDays(filterDays)}
          >
            Apply Filter
          </button>
        </div>

        <ul className="space-y-4">
          {sortedEvents.map((event) => {
            const isEarliest = event.id === earliestEvent?.id;
            const isLatest = event.id === latestEvent?.id;

            return (
              <li
                key={event.id}
                className={`p-4 rounded-lg shadow-md flex justify-between items-center ${
                  isEarliest ? "bg-green-700" : isLatest ? "bg-red-700" : "bg-gray-800"
                }`}
              >
                <div>
                  <h2 className="text-lg font-semibold">{event.name}</h2>
                  <p className="text-gray-400">
                    {event.date} - {event.time}
                  </p>
                  {isEarliest && <p className="text-green-300">🔥 Earliest Event</p>}
                  {isLatest && <p className="text-red-300">🚀 Latest Event</p>}
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => startEditing(event)}
                    className="border-gray-500 text-gray-300 hover:bg-gray-700"
                  >
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={() => handleDeleteEvent(event.id)}>
                    Delete
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}


