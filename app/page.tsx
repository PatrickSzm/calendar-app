"use client"

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [events, setEvents] = useState([]); // State to store events
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for any potential errors

  // useEffect to fetch events from the API when the component mounts
  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/api/events'); // Make the GET request to the API route
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json(); // Parse the JSON data
        setEvents(data); // Set the events data in the state
      } catch (err : any) {
        setError(err.message); // Set the error message if an error occurs
      } finally {
        setLoading(false); // Stop loading once the fetch is complete
      }
    }

    fetchEvents(); // Call the function to fetch the data
  }, []); // Empty dependency array means this will run once on component mount

  // Render loading, error, or events data
  if (loading) return <p>Loading events...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
   <div>Hello <Button variant="destructive">Sug</Button></div>
  );
}
