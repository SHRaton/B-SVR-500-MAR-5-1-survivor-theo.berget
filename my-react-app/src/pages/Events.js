import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react"; // Import the FullCalendar component
import dayGridPlugin from "@fullcalendar/daygrid"; // Import the dayGrid plugin
import timeGridPlugin from "@fullcalendar/timegrid"; // Import the timeGrid plugin
import interactionPlugin from "@fullcalendar/interaction"; // Import the interaction plugin for event handling

function Events() {
  const [events, setEvents] = useState([]);

  // Function to handle adding a new event when a date is clicked
  const handleDateClick = (info) => {
    const eventName = prompt("Enter the event name:");

    if (eventName) {
      const newEvent = {
        title: eventName,
        start: info.dateStr, // Date selected
        allDay: true,
      };
      setEvents([...events, newEvent]);
    }
  };

  return (
    <div>
      <h1>Events Calendar</h1>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth" // Set the initial view to month
        events={events} // Pass the events array to the calendar
        dateClick={handleDateClick} // Handle clicks on dates
        selectable={true}
        editable={true}
      />
    </div>
  );
}

export default Events;
