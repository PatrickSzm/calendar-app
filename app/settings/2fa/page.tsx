"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Event = {
  id: number;
  name: string;
  date: string;
  time: string;
  userId: number;
};

export default function Home() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState<Omit<Event, "id">>({
    name: "",
    date: "",
    time: "",
    userId: 0,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterDays, setFilterDays] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      fetchEvents();
    }
  }, []);

  const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem("token");
    if (token) {
      return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
    }
    return {
      "Content-Type": "application/json",
    };
  };

  const fetchEvents = async () => {
    const res = await fetch("/api/events", {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      setEvents(data);
    } else if (res.status === 401) {
      alert("Unauthorized! Please log in.");
      setEvents([]);
    } else {
      alert("Failed to fetch events");
    }
  };

  const handleAddEvent = async () => {
    if (!newEvent.name || !newEvent.date || !newEvent.time) {
      alert("Completează toate câmpurile!");
      return;
    }

    const res = await fetch("/api/events", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        name: newEvent.name,
        date: newEvent.date,
        time: newEvent.time,
      }),
    });

    if (res.ok) {
      setNewEvent({ name: "", date: "", time: "", userId: 0 });
      fetchEvents();
    } else {
      const error = await res.json();
      alert("Error: " + error.error);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    const res = await fetch(`/api/events/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      fetchEvents();
    } else {
      alert("Failed to delete event");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const startEditing = (event: Event) => {
    setNewEvent({ name: event.name, date: event.date, time: event.time, userId: event.userId });
    setEditingId(event.id);
  };

  const handleEditEvent = async () => {
    if (!editingId) return;

    const res = await fetch(`/api/events/${editingId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        name: newEvent.name,
        date: newEvent.date,
        time: newEvent.time,
      }),
    });

    if (res.ok) {
      setEditingId(null);
      setNewEvent({ name: "", date: "", time: "", userId: 0 });
      fetchEvents();
    } else {
      alert("Failed to edit event");
    }
  };

  // Filtering and sorting logic remains unchanged
  // ... your existing code here ...

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Your UI code unchanged */}
        <button onClick={handleLogout} className="mb-4 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded">
          Logout
        </button>
        {/* rest of the form and event list */}
      </div>
    </div>
  );
}
