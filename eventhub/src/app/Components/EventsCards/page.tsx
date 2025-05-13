"use client";

import { useEventActions, useEventState } from "@/Providers/Event";
import { IEvent, ITicket } from "@/Providers/Event/context";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import QRCode from "react-qr-code";
import styles from "./styles/EventsDisplay.module.css";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

interface ISavedTicket {
  eventId: string;
  ticketId: string;
  ticketCode: string;
  purchaseDate: string;
  event: IEvent;
  ticket: ITicket;
  pdfData?: string;
}

function EventsDisplay() {
  const { events, isPending, isError, errorMessage } = useEventState();
  const { getAllEvents } = useEventActions();
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<ITicket | null>(null);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [ticketData, setTicketData] = useState<{
    eventId: string;
    ticketId: string;
    ticketCode: string;
    purchaseDate: string;
  } | null>(null);
  const [savedTickets, setSavedTickets] = useState<ISavedTicket[]>([]);
  const [showMyTickets, setShowMyTickets] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // useSearchParams() should be wrapped in a suspense boundary at page
  // Filters state
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

  // Load saved tickets from sessionStorage on component mount
  useEffect(() => {
    const loadSavedTickets = () => {
      const tickets: ISavedTicket[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith("ticket_")) {
          const ticket = JSON.parse(sessionStorage.getItem(key)!);
          tickets.push(ticket);
        }
      }
      setSavedTickets(tickets);
    };

    loadSavedTickets();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        await getAllEvents();
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const paymentStatus = searchParams.get("payment_status");
    const eventId = searchParams.get("event_id");
    const ticketId = searchParams.get("ticket_id");

    if (paymentStatus === "success" && eventId && ticketId) {
      const event = events?.find((e) => e.id === eventId);
      const ticket = event?.tickets?.find((t) => t.id === ticketId);

      if (event && ticket) {
        setSelectedEvent(event);
        setSelectedTicket(ticket);
        setPaymentSuccessful(true);

        const ticketCode = generateTicketCode();
        const ticketData = {
          eventId,
          ticketId,
          ticketCode,
          purchaseDate: new Date().toISOString(),
        };
        setTicketData(ticketData);

        // Save the ticket to sessionStorage
        saveTicketToSession(event, ticket, ticketData);

        router.replace("/AttendeeManager/ViewEvents", undefined);
      }
    }
  }, [searchParams, events]);

  // Save ticket data to sessionStorage
  const saveTicketToSession = async (
    event: IEvent,
    ticket: ITicket,
    ticketData: {
      eventId: string;
      ticketId: string;
      ticketCode: string;
      purchaseDate: string;
    }
  ) => {
    const savedTicket: ISavedTicket = {
      ...ticketData,
      event,
      ticket,
    };

    // Optionally generate and store PDF data
    if (ticketRef.current) {
      try {
        // const canvas = await html2canvas(ticketRef.current);
        const pdf = new jsPDF();

        savedTicket.pdfData = pdf.output("datauristring");
      } catch (error) {
        console.error("Error generating PDF for storage:", error);
      }
    }

    sessionStorage.setItem(
      `ticket_${ticketData.ticketCode}`,
      JSON.stringify(savedTicket)
    );
    setSavedTickets((prev) => [...prev, savedTicket]);
  };

  // Redownload a saved ticket
  const redownloadTicket = (ticket: ISavedTicket) => {
    if (ticket.pdfData) {
      // If we stored the PDF data, use that
      const link = document.createElement("a");
      link.href = ticket.pdfData;
      link.download = `${ticket.event.name}-Ticket-${ticket.ticketCode}.pdf`;
      link.click();
    } else {
      // Otherwise regenerate it
      setSelectedEvent(ticket.event);
      setSelectedTicket(ticket.ticket);
      setTicketData({
        eventId: ticket.eventId,
        ticketId: ticket.ticketId,
        ticketCode: ticket.ticketCode,
        purchaseDate: ticket.purchaseDate,
      });
      setPaymentSuccessful(true);
    }
  };

  // Generate a unique ticket code
  const generateTicketCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  // Function to handle clicking on an event card
  const handleEventClick = (event: IEvent) => {
    setSelectedEvent((prev) => (prev?.id === event.id ? null : event));
    setShowPaymentForm(false);
    setSelectedTicket(null);
    setPaymentSuccessful(false);
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
    setPaymentSuccessful(false);
  };

  // Function to handle buy ticket
  const handleBuyTicket = (ticket: ITicket) => {
    setSelectedTicket(ticket);
    setShowPaymentForm(true);
    setPaymentSuccessful(false);
  };

  // Function to close payment form
  const closePaymentForm = () => {
    setShowPaymentForm(false);
    setSelectedTicket(null);
    setPaymentSuccessful(false);
  };

  // Enhanced PDF generation function
  const downloadTicketAsPDF = async () => {
    if (!ticketRef.current) return;

    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 3,
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgWidth = 210;
      const pageWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF("p", "mm", "a4");
      pdf.setFillColor(245, 247, 250);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");
      pdf.setDrawColor(59, 130, 246);
      pdf.setLineWidth(1);
      pdf.line(15, 15, pageWidth - 15, 15);
      pdf.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(22);
      pdf.setTextColor(30, 41, 59);
      pdf.text("Your Event Ticket", 105, 30, { align: "center" });
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      pdf.setTextColor(71, 85, 105);
      pdf.text(`Event: ${selectedEvent?.name}`, 105, 40, { align: "center" });
      pdf.text(`Ticket: ${selectedTicket?.name}`, 105, 47, { align: "center" });
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        25,
        60,
        imgWidth - 50,
        imgHeight - 30
      );
      pdf.setFontSize(11);
      pdf.setTextColor(71, 85, 105);
      const instructionsY = 60 + imgHeight - 20;
      pdf.text("Instructions:", 25, instructionsY);
      pdf.setFontSize(10);
      pdf.text(
        "1. Please arrive at least 30 minutes before the event starts.",
        25,
        instructionsY + 8
      );
      pdf.text(
        "2. Have this ticket ready for scanning at the entrance.",
        25,
        instructionsY + 15
      );
      pdf.text(
        "3. This ticket is valid for one person only and cannot be resold.",
        25,
        instructionsY + 22
      );
      pdf.setFontSize(9);
      pdf.setTextColor(100, 116, 139);
      pdf.text(
        "Powered by Event Ticketing System • Generated on " +
          new Date().toLocaleDateString(),
        105,
        pageHeight - 20,
        { align: "center" }
      );

      pdf.save(`${selectedEvent?.name}-Ticket-${ticketData?.ticketCode}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  // Function to download ticket as image
  const downloadTicketAsImage = async () => {
    if (!ticketRef.current) return;

    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 3,
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${selectedEvent?.name}-Ticket-${ticketData?.ticketCode}.png`;
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  // Function to reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSortOption("date-asc");
    setPriceRange([0, 10000]);
    setDateRange({ startDate: "", endDate: "" });
    setLocationFilter("");
  };

  // Get unique locations for the filter dropdown
  const uniqueLocations = useMemo(() => {
    if (!events) return [];
    const locations = events.map((event) => event.location);
    return [...new Set(locations)].sort();
  }, [events]);

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
    return (
      <div className={styles.loading}>
        {" "}
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
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
          ></button>
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

          {/* Reset filters button */}
          <button onClick={resetFilters} className={styles.resetButton}>
            Reset Filters
          </button>

          {/* My Tickets button */}
          <button
            onClick={() => setShowMyTickets(true)}
            className={styles.myTicketsButton}
          >
            My Tickets ({savedTickets.length})
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
      {selectedEvent && !showPaymentForm && !paymentSuccessful && (
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
      {showPaymentForm &&
        selectedTicket &&
        selectedEvent &&
        !paymentSuccessful && (
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
                  <div
                    className={`${styles.summaryRow} ${styles.priceSummary}`}
                  >
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
                    value={`${
                      typeof window !== "undefined"
                        ? window.location.origin
                        : "http://localhost:3000"
                    }/AttendeeManager/ViewEvents?payment_status=success&event_id=${
                      selectedEvent.id
                    }&ticket_id=${selectedTicket.id || ""}`}
                  />
                  <input
                    type="hidden"
                    name="cancel_url"
                    value={`${
                      typeof window !== "undefined"
                        ? window.location.origin
                        : "http://localhost:3000"
                    }/AttendeeManager/ViewEvents?payment_status=cancelled`}
                  />
                  <input
                    type="hidden"
                    name="notify_url"
                    value={`${
                      typeof window !== "undefined"
                        ? window.location.origin
                        : "http://localhost:3000"
                    }/api/payment-notifications`}
                  />

                  {/* Additional custom fields */}
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

      {/* Enhanced Ticket success and download modal */}
      {paymentSuccessful && selectedEvent && selectedTicket && ticketData && (
        <div className={styles.ticketDetailsOverlay}>
          <div className={styles.ticketDetailsModal}>
            <button
              className={styles.closeButton}
              onClick={closeTicketDetails}
              aria-label="Close"
            >
              ×
            </button>

            <h2 className={styles.modalTitle}>Payment Successful!</h2>
            <p className={styles.successMessage}>
              Thank you for your purchase. Your ticket is ready to download.
            </p>

            {/* Enhanced Ticket Preview */}
            <div className={styles.ticketPreviewContainer}>
              <div className={styles.ticketPreview} ref={ticketRef}>
                <div className={styles.ticketHeader}>
                  <h3 className={styles.ticketTitle}>{selectedEvent.name}</h3>
                  <p className={styles.ticketType}>{selectedTicket.name}</p>
                </div>

                <div className={styles.ticketBody}>
                  <div className={styles.ticketInfo}>
                    <div className={styles.ticketDetail}>
                      <span className={styles.detailLabel}>Event Date</span>
                      <span className={styles.detailValue}>
                        {formatDate(selectedEvent.startDate)}
                      </span>
                    </div>
                    <div className={styles.ticketDetail}>
                      <span className={styles.detailLabel}>Location</span>
                      <span className={styles.detailValue}>
                        {selectedEvent.location}
                      </span>
                    </div>
                    <div className={styles.ticketDetail}>
                      <span className={styles.detailLabel}>Ticket Type</span>
                      <span className={styles.detailValue}>
                        {selectedTicket.type}
                      </span>
                    </div>
                    <div className={styles.ticketDetail}>
                      <span className={styles.detailLabel}>Price</span>
                      <span className={styles.detailValue}>
                        R{selectedTicket.price.toFixed(2)}
                      </span>
                    </div>
                    <div className={styles.ticketDetail}>
                      <span className={styles.detailLabel}>Ticket Code</span>
                      <span className={styles.detailValue}>
                        {ticketData.ticketCode}
                      </span>
                    </div>
                    <div className={styles.ticketDetail}>
                      <span className={styles.detailLabel}>Purchase Date</span>
                      <span className={styles.detailValue}>
                        {formatDate(ticketData.purchaseDate)}
                      </span>
                    </div>
                  </div>

                  <div className={styles.qrCodeContainer}>
                    <QRCode
                      value={`${selectedEvent.id}|${selectedTicket.id}|${ticketData.ticketCode}`}
                      size={120}
                      level="H"
                    />
                  </div>
                </div>

                <div className={styles.ticketFooter}>
                  <p className={styles.ticketNote}>
                    Please present this ticket at the entrance. Valid for one
                    person only.
                  </p>
                  <div className={styles.eventLogo}>EVENT</div>
                </div>
              </div>
            </div>

            {/* Enhanced Download Buttons */}
            <div className={styles.downloadButtons}>
              <button
                onClick={downloadTicketAsPDF}
                className={`${styles.downloadButton} ${styles.pdfButton}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="12" y1="18" x2="12" y2="12"></line>
                  <line x1="9" y1="15" x2="15" y2="15"></line>
                </svg>
                Download PDF
              </button>
              <button
                onClick={downloadTicketAsImage}
                className={`${styles.downloadButton} ${styles.imageButton}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                Download Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* My Tickets Modal */}
      {showMyTickets && (
        <div className={styles.ticketDetailsOverlay}>
          <div className={styles.ticketDetailsModal}>
            <button
              className={styles.closeButton}
              onClick={() => setShowMyTickets(false)}
              aria-label="Close"
            >
              ×
            </button>

            <h2 className={styles.modalTitle}>My Tickets</h2>

            {savedTickets.length > 0 ? (
              <div className={styles.ticketList}>
                {savedTickets.map((ticket) => (
                  <div
                    key={ticket.ticketCode}
                    className={styles.savedTicketItem}
                  >
                    <div className={styles.savedTicketInfo}>
                      <h3>{ticket.event.name}</h3>
                      <p>Ticket: {ticket.ticket.name}</p>
                      <p>Code: {ticket.ticketCode}</p>
                      <p>Purchased: {formatDate(ticket.purchaseDate)}</p>
                    </div>
                    <button
                      onClick={() => redownloadTicket(ticket)}
                      className={styles.downloadButton}
                    >
                      Download Again
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noTickets}>
                No saved tickets found in your current session
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EventsDisplay />
    </Suspense>
  );
}
