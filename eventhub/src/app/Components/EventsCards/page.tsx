// "use client";

// import { useState, useEffect } from "react";
// import { useEventState, useEventActions } from "@/Providers/Event";
// import { IEvent, ITicket } from "@/Providers/Event/context";
// import styles from "./styles/EventsDisplay.module.css";
// import Image from "next/image";

// const EventsDisplay = () => {
//   const { events, isPending, isError, errorMessage } = useEventState();
//   const { getAllEvents } = useEventActions();
//   const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
//   const [showPaymentForm, setShowPaymentForm] = useState(false);
//   const [selectedTicket, setSelectedTicket] = useState<ITicket | null>(null);

//   useEffect(() => {
//     // Fetch all events when component mounts
//     const fetchEvents = async () => {
//       try {
//         await getAllEvents();
//       } catch (error) {
//         console.error("Failed to fetch events:", error);
//       }
//     };

//     fetchEvents();
//   }, []);

//   // Function to handle clicking on an event card
//   const handleEventClick = (event: IEvent) => {
//     setSelectedEvent((prev) => (prev?.id === event.id ? null : event));
//     // Reset payment form when changing events
//     setShowPaymentForm(false);
//     setSelectedTicket(null);
//   };

//   // Function to format date
//   const formatDate = (dateString: string | Date) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   // Function to close ticket details
//   const closeTicketDetails = () => {
//     setSelectedEvent(null);
//     setShowPaymentForm(false);
//     setSelectedTicket(null);
//   };

//   // Function to handle buy ticket
//   const handleBuyTicket = (ticket: ITicket) => {
//     setSelectedTicket(ticket);
//     setShowPaymentForm(true);
//   };

//   // Function to close payment form
//   const closePaymentForm = () => {
//     setShowPaymentForm(false);
//     setSelectedTicket(null);
//   };

//   if (isPending) {
//     return <div className={styles.loading}>Loading events...</div>;
//   }

//   if (isError) {
//     return <div className={styles.error}>Error: {errorMessage}</div>;
//   }

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>Events</h1>

//       <div className={styles.eventsGrid}>
//         {events && events.length > 0 ? (
//           events.map((event) => (
//             <div
//               key={event.id}
//               className={`${styles.eventCard} ${
//                 selectedEvent?.id === event.id ? styles.selectedCard : ""
//               }`}
//               onClick={() => handleEventClick(event)}
//             >
//               <div className={styles.eventImageContainer}>
//                 {event.imageUrl ? (
//                   <Image
//                     src={event.imageUrl}
//                     alt={event.name}
//                     fill
//                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                     className={styles.eventImage}
//                   />
//                 ) : (
//                   <div className={styles.placeholderImage}>No Image</div>
//                 )}
//               </div>

//               <div className={styles.eventInfo}>
//                 <h2 className={styles.eventName}>{event.name}</h2>
//                 <p className={styles.eventDate}>
//                   <span className={styles.dateLabel}>From:</span>{" "}
//                   {formatDate(event.startDate)}
//                 </p>
//                 <p className={styles.eventDate}>
//                   <span className={styles.dateLabel}>To:</span>{" "}
//                   {formatDate(event.endDate)}
//                 </p>
//                 <p className={styles.eventLocation}>
//                   <span className={styles.locationIcon}>📍</span>{" "}
//                   {event.location}
//                 </p>
//                 <p className={styles.eventPrice}>R{event.price.toFixed(2)}</p>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className={styles.noEvents}>No events found</div>
//         )}
//       </div>

//       {/* Ticket Details Modal */}
//       {selectedEvent && !showPaymentForm && (
//         <div className={styles.ticketDetailsOverlay}>
//           <div className={styles.ticketDetailsModal}>
//             <button
//               className={styles.closeButton}
//               onClick={closeTicketDetails}
//               aria-label="Close"
//             >
//               ×
//             </button>

//             <h2 className={styles.modalTitle}>
//               {selectedEvent.name} - Tickets
//             </h2>
//             <p className={styles.eventDescription}>
//               {selectedEvent.description}
//             </p>

//             {selectedEvent.tickets && selectedEvent.tickets.length > 0 ? (
//               <div className={styles.ticketsContainer}>
//                 {selectedEvent.tickets.map((ticket: ITicket, index: number) => (
//                   <div key={ticket.id || index} className={styles.ticketCard}>
//                     <h3 className={styles.ticketName}>{ticket.name}</h3>
//                     <p className={styles.ticketDescription}>
//                       {ticket.description}
//                     </p>
//                     <div className={styles.ticketDetails}>
//                       <p className={styles.ticketPrice}>
//                         <span className={styles.detailLabel}>Price:</span> R
//                         {ticket.price.toFixed(2)}
//                       </p>
//                       <p className={styles.ticketQuantity}>
//                         <span className={styles.detailLabel}>Available:</span>{" "}
//                         {ticket.remainingQuantity ?? ticket.quantity}/
//                         {ticket.quantity}
//                       </p>
//                       <p className={styles.ticketType}>
//                         <span className={styles.detailLabel}>Type:</span>{" "}
//                         {ticket.type}
//                       </p>
//                     </div>
//                     <button
//                       className={styles.buyButton}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleBuyTicket(ticket);
//                       }}
//                     >
//                       Buy Ticket
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className={styles.noTickets}>
//                 No tickets available for this event
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* PayFast Payment Form Modal */}
//       {showPaymentForm && selectedTicket && selectedEvent && (
//         <div className={styles.ticketDetailsOverlay}>
//           <div className={styles.ticketDetailsModal}>
//             <button
//               className={styles.closeButton}
//               onClick={closePaymentForm}
//               aria-label="Close"
//             >
//               ×
//             </button>

//             <h2 className={styles.modalTitle}>Complete Purchase</h2>
//             <div className={styles.paymentSummary}>
//               <h3 className={styles.summaryTitle}>Order Summary</h3>
//               <div className={styles.summaryDetails}>
//                 <div className={styles.summaryRow}>
//                   <span className={styles.summaryLabel}>Event:</span>
//                   <span className={styles.summaryValue}>
//                     {selectedEvent.name}
//                   </span>
//                 </div>
//                 <div className={styles.summaryRow}>
//                   <span className={styles.summaryLabel}>Ticket:</span>
//                   <span className={styles.summaryValue}>
//                     {selectedTicket.name}
//                   </span>
//                 </div>
//                 <div className={`${styles.summaryRow} ${styles.priceSummary}`}>
//                   <span className={styles.summaryLabel}>Price:</span>
//                   <span className={styles.priceValue}>
//                     R{selectedTicket.price.toFixed(2)}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className={styles.paymentFormContainer}>
//               <form
//                 action="	https://sandbox.payfast.co.za/eng/process"
//                 method="post"
//                 className={styles.paymentForm}
//               >
//                 {/* Required PayFast parameters */}
//                 <input type="hidden" name="merchant_id" value="10035120" />
//                 <input
//                   type="hidden"
//                   name="merchant_key"
//                   value="x42jy6af158af"
//                 />
//                 <input
//                   type="hidden"
//                   name="amount"
//                   value={selectedTicket.price.toFixed(2)}
//                 />
//                 <input
//                   type="hidden"
//                   name="item_name"
//                   value={`${selectedEvent.name} - ${selectedTicket.name}`}
//                 />

//                 {/* Optional but recommended PayFast parameters */}
//                 <input
//                   type="hidden"
//                   name="return_url"
//                   value={`${window.location.origin}/payment-success`}
//                 />
//                 <input
//                   type="hidden"
//                   name="cancel_url"
//                   value={`${window.location.origin}/payment-cancelled`}
//                 />
//                 <input
//                   type="hidden"
//                   name="notify_url"
//                   value={`${window.location.origin}/api/payment-notifications`}
//                 />

//                 {/* Additional custom fields - you can add more as needed */}
//                 <input
//                   type="hidden"
//                   name="custom_str1"
//                   value={selectedEvent.id}
//                 />
//                 <input
//                   type="hidden"
//                   name="custom_str2"
//                   value={selectedTicket.id || ""}
//                 />
//                 <input
//                   type="hidden"
//                   name="custom_str3"
//                   value={selectedTicket.type}
//                 />

//                 <button type="submit" className={styles.paymentButton}>
//                   Proceed to Payment
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EventsDisplay;
"use client";

import { useState, useEffect, useMemo } from "react";
import { useEventState, useEventActions } from "@/Providers/Event";
import { IEvent, ITicket } from "@/Providers/Event/context";
import styles from "./styles/EventsDisplay.module.css";
import Image from "next/image";

const EventsDisplay = () => {
  const { events, isPending, isError, errorMessage } = useEventState();
  const { getAllEvents } = useEventActions();
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<ITicket | null>(null);

  // Added state for filters, search, and sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("date-asc");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: "",
    endDate: "",
  });
  const [locationFilter, setLocationFilter] = useState("");

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

  // Get unique locations for the filter dropdown
  const uniqueLocations = useMemo(() => {
    if (!events) return [];
    const locations = events.map((event) => event.location);
    return [...new Set(locations)].sort();
  }, [events]);

  // Function to handle clicking on an event card
  const handleEventClick = (event: IEvent) => {
    setSelectedEvent((prev) => (prev?.id === event.id ? null : event));
    // Reset payment form when changing events
    setShowPaymentForm(false);
    setSelectedTicket(null);
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
    setShowPaymentForm(false);
    setSelectedTicket(null);
  };

  // Function to handle buy ticket
  const handleBuyTicket = (ticket: ITicket) => {
    setSelectedTicket(ticket);
    setShowPaymentForm(true);
  };

  // Function to close payment form
  const closePaymentForm = () => {
    setShowPaymentForm(false);
    setSelectedTicket(null);
  };

  // Function to reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSortOption("date-asc");
    setPriceRange([0, 10000]);
    setDateRange({ startDate: "", endDate: "" });
    setLocationFilter("");
  };

  // Apply filters and sorting to events
  const filteredAndSortedEvents = useMemo(() => {
    if (!events) return [];

    let filtered = [...events];

    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(lowerSearchTerm) ||
          event.description.toLowerCase().includes(lowerSearchTerm) ||
          event.location.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Apply price range filter
    filtered = filtered.filter(
      (event) => event.price >= priceRange[0] && event.price <= priceRange[1]
    );

    // Apply date range filter
    if (dateRange.startDate) {
      const startDate = new Date(dateRange.startDate);
      filtered = filtered.filter(
        (event) => new Date(event.startDate) >= startDate
      );
    }

    if (dateRange.endDate) {
      const endDate = new Date(dateRange.endDate);
      filtered = filtered.filter((event) => new Date(event.endDate) <= endDate);
    }

    // Apply location filter
    if (locationFilter) {
      filtered = filtered.filter((event) => event.location === locationFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortOption) {
        case "date-asc":
          return (
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          );
        case "date-desc":
          return (
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          );
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [events, searchTerm, sortOption, priceRange, dateRange, locationFilter]);

  if (isPending) {
    return <div className={styles.loading}>Loading events...</div>;
  }

  if (isError) {
    return <div className={styles.error}>Error: {errorMessage}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Events</h1>

      {/* Search and Filters Section */}
      <div className={styles.filtersContainer}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <button
            className={styles.searchButton}
            onClick={() => setSearchTerm("")}
            aria-label="Clear search"
          >
            {searchTerm ? "×" : "🔍"}
          </button>
        </div>

        <div className={styles.filtersRow}>
          {/* Sort dropdown */}
          <div className={styles.filterGroup}>
            <label htmlFor="sort-select" className={styles.filterLabel}>
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="date-asc">Date (Earliest first)</option>
              <option value="date-desc">Date (Latest first)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>

          {/* Location filter */}
          <div className={styles.filterGroup}>
            <label htmlFor="location-select" className={styles.filterLabel}>
              Location:
            </label>
            <select
              id="location-select"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">All Locations</option>
              {uniqueLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Price range filter */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>
              Price Range: R{priceRange[0]} - R{priceRange[1]}
            </label>
            <div className={styles.rangeInputs}>
              <input
                type="number"
                min="0"
                max={priceRange[1]}
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([Number(e.target.value), priceRange[1]])
                }
                className={styles.numberInput}
              />
              <span>to</span>
              <input
                type="number"
                min={priceRange[0]}
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
                className={styles.numberInput}
              />
            </div>
          </div>

          {/* Date filters */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Date Range:</label>
            <div className={styles.dateInputs}>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, startDate: e.target.value })
                }
                className={styles.dateInput}
                placeholder="Start date"
              />
              <span>to</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, endDate: e.target.value })
                }
                className={styles.dateInput}
                placeholder="End date"
              />
            </div>
          </div>

          {/* Reset filters button */}
          <button onClick={resetFilters} className={styles.resetButton}>
            Reset Filters
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className={styles.resultsCount}>
        {filteredAndSortedEvents.length}{" "}
        {filteredAndSortedEvents.length === 1 ? "event" : "events"} found
      </div>

      <div className={styles.eventsGrid}>
        {filteredAndSortedEvents.length > 0 ? (
          filteredAndSortedEvents.map((event) => (
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
          <div className={styles.noEvents}>
            No events found matching your filters
          </div>
        )}
      </div>

      {/* Ticket Details Modal */}
      {selectedEvent && !showPaymentForm && (
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
                    <button
                      className={styles.buyButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBuyTicket(ticket);
                      }}
                    >
                      Buy Ticket
                    </button>
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

      {/* PayFast Payment Form Modal */}
      {showPaymentForm && selectedTicket && selectedEvent && (
        <div className={styles.ticketDetailsOverlay}>
          <div className={styles.ticketDetailsModal}>
            <button
              className={styles.closeButton}
              onClick={closePaymentForm}
              aria-label="Close"
            >
              ×
            </button>

            <h2 className={styles.modalTitle}>Complete Purchase</h2>
            <div className={styles.paymentSummary}>
              <h3 className={styles.summaryTitle}>Order Summary</h3>
              <div className={styles.summaryDetails}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Event:</span>
                  <span className={styles.summaryValue}>
                    {selectedEvent.name}
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Ticket:</span>
                  <span className={styles.summaryValue}>
                    {selectedTicket.name}
                  </span>
                </div>
                <div className={`${styles.summaryRow} ${styles.priceSummary}`}>
                  <span className={styles.summaryLabel}>Price:</span>
                  <span className={styles.priceValue}>
                    R{selectedTicket.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.paymentFormContainer}>
              <form
                action="https://sandbox.payfast.co.za/eng/process"
                method="post"
                className={styles.paymentForm}
              >
                {/* Required PayFast parameters */}
                <input type="hidden" name="merchant_id" value="10035120" />
                <input
                  type="hidden"
                  name="merchant_key"
                  value="x42jy6af158af"
                />
                <input
                  type="hidden"
                  name="amount"
                  value={selectedTicket.price.toFixed(2)}
                />
                <input
                  type="hidden"
                  name="item_name"
                  value={`${selectedEvent.name} - ${selectedTicket.name}`}
                />

                {/* Optional but recommended PayFast parameters */}
                <input
                  type="hidden"
                  name="return_url"
                  value={`${window.location.origin}/payment-success`}
                />
                <input
                  type="hidden"
                  name="cancel_url"
                  value={`${window.location.origin}/payment-cancelled`}
                />
                <input
                  type="hidden"
                  name="notify_url"
                  value={`${window.location.origin}/api/payment-notifications`}
                />

                {/* Additional custom fields - you can add more as needed */}
                <input
                  type="hidden"
                  name="custom_str1"
                  value={selectedEvent.id}
                />
                <input
                  type="hidden"
                  name="custom_str2"
                  value={selectedTicket.id || ""}
                />
                <input
                  type="hidden"
                  name="custom_str3"
                  value={selectedTicket.type}
                />

                <button type="submit" className={styles.paymentButton}>
                  Proceed to Payment
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsDisplay;
