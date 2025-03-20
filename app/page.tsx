"use client"

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";

type Event = {
  id: number;
  name: string;
  date: string;
  time: string;
};

export default function Home() {
  const [events, setEvents] = useState<Event[]>([
    { id: 1, name: "Concert Armin Van Buuren", date: "2025-04-10", time: "20:00" },
    { id: 2, name: "Hackathon AI", date: "2025-05-20", time: "09:30" },
    { id: 3, name: "EDM Festival", date: "2025-06-15", time: "18:00" },
  ]);
  
  const [newEvent, setNewEvent] = useState<Omit<Event, "id">>({ name: "", date: "", time:"" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });
  
  const handleAddEvent = () => {
    if (!newEvent.name || !newEvent.date) {
      alert("Completează toate câmpurile!");
      return;
    }
    const newEventObject: Event = { id: events.length + 1, ...newEvent };
    setEvents([...events, newEventObject]);
    setNewEvent({ name: "", date: "", time: "" });
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  const startEditing = (event: Event) => {
    setNewEvent({ name: event.name, date: event.date , time: event.time});
    setEditingId(event.id);
  };

  const handleEditEvent = () => {
    if (!newEvent.name || !newEvent.date || !newEvent.time) {
      alert("Completează toate câmpurile!");
      return;
    }
    setEvents(events.map((event) => (event.id === editingId ? { ...event, ...newEvent } : event)));
    setEditingId(null);
    setNewEvent({ name: "", date: "", time: "" });
  };
  
  const [filterDays, setFilterDays] = useState<number | null>(null);
  const filteredEvents = sortedEvents.filter((event) => {
    if (!filterDays) return true;
    const today = new Date();
    const eventDate = new Date(event.date);
    const diffInDays = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffInDays <= filterDays;
  });
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">🎉 Upcoming Events</h1>

        {/* Add/edit form */}
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

          {/* filter until days */}

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

        {/* Show event list */}
        
        <ul className="space-y-4">
          {filteredEvents.map((event) => (
            <li key={event.id} className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">{event.name}</h2>
                <p className="text-gray-400">{event.date} - {event.time}</p>
              </div>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => startEditing(event)} className="border-gray-500 text-gray-300 hover:bg-gray-700">
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteEvent(event.id)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


