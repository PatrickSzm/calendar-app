

type Event = {
  id: number;
  name: string;
  date: string;
  time: string;
};
  export function filterEvents(events: Event[], filterDays: number|null):Event[] {
    return events.filter((event) => {
      if (!filterDays) return true;
      const today = new Date();
      const eventDate = new Date(event.date);
      const diffInDays = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diffInDays <= filterDays;
    });
  }
describe("filterEvents", () => {
    // Test for no filter (filterDays is null or 0)
    it("should return all events when no filter is applied", () => {
      const events: Event[] = [
        { id: 1, name: "Event 1", date: "2025-04-10", time: "20:00" },
        { id: 2, name: "Event 2", date: "2025-05-20", time: "09:30" },
      ];
  
      expect(filterEvents(events, null)).toEqual(events);
      expect(filterEvents(events, 0)).toEqual(events);
    });
  
    // Test for filtering by number of days
    it("should filter events within the given number of days", () => {
      const events: Event[] = [
        { id: 1, name: "Event 1", date: "2025-04-10", time: "20:00" },
        { id: 2, name: "Event 2", date: "2025-05-20", time: "09:30" },
      ];
  
      const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
      const filterDays = 30;
  
      const filteredEvents = filterEvents(events, filterDays);
  
      // Assuming today's date is within 30 days of Event 1 and not Event 2
      expect(filteredEvents.length).toBe(1);
      expect(filteredEvents[0].name).toBe("Event 1");
    });
  
    // Test for no events within the filter days
    it("should return an empty array if no events are within the filter days", () => {
      const events: Event[] = [
        { id: 1, name: "Event 1", date: "2025-04-21", time: "20:00" },
        { id: 2, name: "Event 2", date: "2025-06-20", time: "09:30" },
      ];
  
      const filterDays = 30; // Assuming these events are more than 30 days away from today
      const filteredEvents = filterEvents(events, filterDays);
  
      expect(filteredEvents.length).toBe(0);
    });
  });