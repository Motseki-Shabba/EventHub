"use client";

import { useState, useEffect } from "react";
import { useEventState, useEventActions } from "@/Providers/Event";
import { IEvent, ITicket } from "@/Providers/Event/context";
import styles from "./styles/EventsDisplay.module.css";
import Image from "next/image";

const EventsDisplay = () => {
  const { events, isPending, isError, errorMessage } = useEventState();
  const { getAllEvents } = useEventActions();
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);

  useEffect(() => {
    // Fetch all events when component mounts
    const fetchEvents = async () => {
      try {
        await getAllEvents();
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    fetchEvents();
  }, []);

  // Function to handle clicking on an event card
  const handleEventClick = (event: IEvent) => {
    setSelectedEvent((prev) => (prev?.id === event.id ? null : event));
  };

  // Function to format date
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Function to close ticket details
  const closeTicketDetails = () => {
    setSelectedEvent(null);
  };

  if (isPending) {
    return <div className={styles.loading}>Loading events...</div>;
  }

  if (isError) {
    return <div className={styles.error}>Error: {errorMessage}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Events</h1>

      <div className={styles.eventsGrid}>
        {events && events.length > 0 ? (
          events.map((event) => (
            <div
              key={event.id}
              className={`${styles.eventCard} ${
                selectedEvent?.id === event.id ? styles.selectedCard : ""
              }`}
              onClick={() => handleEventClick(event)}
            >
              <div className={styles.eventImageContainer}>
                {event.imageUrl ? (
                  <Image
                    src={event.imageUrl}
                    alt={event.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.eventImage}
                  />
                ) : (
                  <div className={styles.placeholderImage}>No Image</div>
                )}
              </div>

              <div className={styles.eventInfo}>
                <h2 className={styles.eventName}>{event.name}</h2>
                <p className={styles.eventDate}>
                  <span className={styles.dateLabel}>From:</span>{" "}
                  {formatDate(event.startDate)}
                </p>
                <p className={styles.eventDate}>
                  <span className={styles.dateLabel}>To:</span>{" "}
                  {formatDate(event.endDate)}
                </p>
                <p className={styles.eventLocation}>
                  <span className={styles.locationIcon}>📍</span>{" "}
                  {event.location}
                </p>
                <p className={styles.eventPrice}>R{event.price.toFixed(2)}</p>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noEvents}>No events found</div>
        )}
      </div>

      {/* Ticket Details Modal */}
      {selectedEvent && (
        <div className={styles.ticketDetailsOverlay}>
          <div className={styles.ticketDetailsModal}>
            <button
              className={styles.closeButton}
              onClick={closeTicketDetails}
              aria-label="Close"
            >
              ×
            </button>

            <h2 className={styles.modalTitle}>
              {selectedEvent.name} - Tickets
            </h2>
            <p className={styles.eventDescription}>
              {selectedEvent.description}
            </p>

            {selectedEvent.tickets && selectedEvent.tickets.length > 0 ? (
              <div className={styles.ticketsContainer}>
                {selectedEvent.tickets.map((ticket: ITicket, index: number) => (
                  <div key={ticket.id || index} className={styles.ticketCard}>
                    <h3 className={styles.ticketName}>{ticket.name}</h3>
                    <p className={styles.ticketDescription}>
                      {ticket.description}
                    </p>
                    <div className={styles.ticketDetails}>
                      <p className={styles.ticketPrice}>
                        <span className={styles.detailLabel}>Price:</span> R
                        {ticket.price.toFixed(2)}
                      </p>
                      <p className={styles.ticketQuantity}>
                        <span className={styles.detailLabel}>Available:</span>{" "}
                        {ticket.remainingQuantity ?? ticket.quantity}/
                        {ticket.quantity}
                      </p>
                      <p className={styles.ticketType}>
                        <span className={styles.detailLabel}>Type:</span>{" "}
                        {ticket.type}
                      </p>
                    </div>
                    <button className={styles.buyButton}>Buy Ticket</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noTickets}>
                No tickets available for this event
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsDisplay;
