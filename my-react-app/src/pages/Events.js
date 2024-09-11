import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react"; // Import the FullCalendar component
import dayGridPlugin from "@fullcalendar/daygrid"; // Import the dayGrid plugin
import timeGridPlugin from "@fullcalendar/timegrid"; // Import the timeGrid plugin
import interactionPlugin from "@fullcalendar/interaction"; // Import the interaction plugin for event handling
import L from 'leaflet'; // Import Leaflet
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import './Events.css'; // Import your CSS file
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

function Events() {
  const [events, setEvents] = useState([]);
  const [map, setMap] = useState(null); // State to hold the map instance
  const isLoggedIn = Cookies.get('isLoggedIn');
  const navigate = useNavigate();

  // Fonction pour récupérer les événements depuis l'API
  useEffect(() => {
    fetch('http://localhost:5000/api/events')
      .then(response => response.json())
      .then(data => {
        // Convertir les événements de l'API au format FullCalendar
        const formattedEvents = data.data.map(event => ({
          title: event.name,
          start: event.date, // Assurez-vous que le champ "date" est bien au format ISO (ex: '2024-09-10T10:00:00')
          allDay: true,
          extendedProps: {
            locationX: event.location_x, // Ajout des coordonnées dans les propriétés étendues
            locationY: event.location_y,
            maxParticipant: event.max_participant,
            id: event.id,
            type: event.type,
            employeeId: event.employee_id,
            locationName: event.location_name,
          },
        }));
        setEvents(formattedEvents);
      })
      .catch(error => console.error('Error fetching events:', error));
  }, []);

  // Fonction pour gérer le clic sur une date
  const handleDateClick = (info) => {
    const eventName = prompt("Enter the event name:");

    if (eventName) {
      const newEvent = {
        title: eventName,
        start: info.dateStr, // Utilisez la date cliquée
        allDay: true,
      };
      setEvents([...events, newEvent]); // Ajoute l'événement au tableau d'événements
    }
  };

  const defaultIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41], // Taille de l'icône
    iconAnchor: [12, 41], // Ancrage de l'icône
    popupAnchor: [1, -44] // Ancrage de la popup
  });

  // Fonction pour gérer le clic sur un événement
  const handleEventClick = (info) => {
    const { locationX, locationY, maxParticipant, id, type, employeeId, locationName } = info.event.extendedProps;
    if (map && locationX && locationY) {
      map.setView([locationX, locationY], 6); // Mettre à jour la vue de la carte avec les nouvelles coordonnées
      L.marker([locationX, locationY], { icon: defaultIcon }).addTo(map)
        .bindPopup(`
          <strong>Event:</strong> ${info.event.title}<br>
          <strong>ID:</strong> ${id}<br>
          <strong>Date:</strong> ${info.event.startStr}<br>
          <strong>Max Participants:</strong> ${maxParticipant}<br>
          <strong>Location X:</strong> ${locationX}<br>
          <strong>Location Y:</strong> ${locationY}<br>
          <strong>Type:</strong> ${type}<br>
          <strong>Employee ID:</strong> ${employeeId}<br>
          <strong>Location Name:</strong> ${locationName}
        `)
        .openPopup();
    }
  };

  // Initialiser la carte avec Leaflet
  useEffect(() => {
    const mapInstance = L.map('map').setView([43.597, 1.441], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance);

    setMap(mapInstance); // Sauvegarder l'instance de la carte dans l'état

    // Nettoyage pour éviter la réinitialisation de la carte
    return () => {
      mapInstance.remove();
    };
  }, []);

  return (
    <div className="calendar-container">
      <div className="top-bar">
        <h1>Events Calendar</h1>
      </div>
      <div className="boxEvent">
        <div className="gaucheEvent">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events} // Ajoutez les événements ici
            dateClick={handleDateClick} // Gestion du clic sur une date
            eventClick={handleEventClick} // Gestion du clic sur un événement
            selectable={true}
            editable={true}
          />
        </div>
        <div className="droiteEvent">
          <div id="map" style={{ height: "100%", width: "100%" }}></div>
        </div>
      </div>
    </div>
  );
}

export default Events;
