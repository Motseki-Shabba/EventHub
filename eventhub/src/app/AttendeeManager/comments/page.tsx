"use client";

import { useEventActions, useEventState } from "@/Providers/Event";
import { IEvent } from "@/Providers/Event/context";
import { useCommentActions, useCommentState } from "@/Providers/comments";
import { ICreateCommentRequest } from "@/Providers/comments/context";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin, notification } from "antd";
import Image from "next/image";
import { Suspense, useEffect, useMemo, useState } from "react";
import styles from "./style/CommentComponent.module.css";

function EventsDisplayWithComment() {
  const { events, isPending, isError, errorMessage } = useEventState();
  const { getAllEvents, resetStateFlags } = useEventActions();
  const {
    createComment,
    getEventComments,
    setupSignalRConnection,
    disconnectSignalR,
  } = useCommentActions();
  const {
    comments,
    isPending: isCommentPending,
    isError: isCommentError,
  } = useCommentState();

  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const [, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState("");
  // const router = useRouter();
  const [api, contextHolder] = notification.useNotification();

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

  // Fetch all events when component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        await getAllEvents();
      } catch (error) {
        console.error("Failed to fetch events:", error);
        api.error({
          message: "Error",
          description: "Failed to fetch events. Please try again later.",
        });
      }
    };

    fetchEvents();

    // Reset state flags when component unmounts
    return () => {
      resetStateFlags();
      disconnectSignalR();
    };
  }, []);

  // Fetch comments when an event is selected
  useEffect(() => {
    if (selectedEvent) {
      const fetchComments = async () => {
        try {
          if (selectedEvent.id) {
            await getEventComments(selectedEvent.id);
          }
          if (selectedEvent.id) {
            await setupSignalRConnection(selectedEvent.id);
          }
        } catch (error) {
          console.error("Failed to fetch comments:", error);
        }
      };

      fetchComments();
    }
  }, [selectedEvent]);

  // Function to handle clicking on an event card
  const handleEventClick = (event: IEvent) => {
    if (selectedEvent?.id === event.id) {
      // If clicking the same event, close it
      setSelectedEvent(null);
      setShowCommentInput(false);
      disconnectSignalR();
    } else {
      // If clicking a different event, select it
      setSelectedEvent(event);
      setShowCommentInput(true);
    }
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

  // Function to close event details
  const closeEventDetails = () => {
    setSelectedEvent(null);
    setShowCommentInput(false);
    disconnectSignalR();
  };

  // Function to handle comment submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentText.trim() || !selectedEvent) {
      return;
    }

    try {
      const commentRequest: ICreateCommentRequest = {
        text: commentText.trim(),
        eventId: selectedEvent.id ?? "",
      };

      await createComment(commentRequest);
      setCommentText("");
      api.success({
        message: "Success",
        description: "Your comment was posted successfully!",
      });
    } catch (error) {
      console.error("Failed to post comment:", error);
      api.error({
        message: "Error",
        description: "Failed to post your comment. Please try again.",
      });
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
        <Spin indicator={<LoadingOutlined spin />} size="large" />
        <p>Loading events...</p>
      </div>
    );
  }

  if (isError) {
    return <div className={styles.error}>Error: {errorMessage}</div>;
  }

  return (
    <div className={styles.container}>
      {contextHolder}
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

      {/* Event Details Modal with Comments */}
      {selectedEvent && (
        <div className={styles.eventDetailsOverlay}>
          <div className={styles.eventDetailsModal}>
            <button
              className={styles.closeButton}
              onClick={closeEventDetails}
              aria-label="Close"
            >
              ×
            </button>

            <div className={styles.eventModalContent}>
              <div className={styles.eventDetailsSection}>
                <h2 className={styles.modalTitle}>{selectedEvent.name}</h2>

                <div className={styles.eventDetailRow}>
                  <span className={styles.detailLabel}>Date:</span>
                  <span>
                    {formatDate(selectedEvent.startDate)} -{" "}
                    {formatDate(selectedEvent.endDate)}
                  </span>
                </div>

                <div className={styles.eventDetailRow}>
                  <span className={styles.detailLabel}>Location:</span>
                  <span>{selectedEvent.location}</span>
                </div>

                <div className={styles.eventDetailRow}>
                  <span className={styles.detailLabel}>Price:</span>
                  <span>R{selectedEvent.price.toFixed(2)}</span>
                </div>

                <p className={styles.eventDescription}>
                  {selectedEvent.description}
                </p>
              </div>

              <div className={styles.commentsSection}>
                <h3 className={styles.commentsTitle}>Comments</h3>

                {isCommentPending ? (
                  <div className={styles.commentLoading}>
                    <Spin size="small" />
                    <span>Loading comments...</span>
                  </div>
                ) : isCommentError ? (
                  <div className={styles.commentError}>
                    Failed to load comments. Please try again.
                  </div>
                ) : (
                  <>
                    <div className={styles.commentsList}>
                      {comments && comments.length > 0 ? (
                        comments.map((comment) => (
                          <div key={comment.id} className={styles.commentItem}>
                            <div className={styles.commentHeader}>
                              <span className={styles.commentUser}>
                                {comment.userName}
                              </span>
                              <span className={styles.commentDate}>
                                {formatDate(comment.creationTime)}
                              </span>
                            </div>
                            <p className={styles.commentText}>{comment.text}</p>
                          </div>
                        ))
                      ) : (
                        <p className={styles.noComments}>
                          No comments yet. Be the first to comment!
                        </p>
                      )}
                    </div>

                    <form
                      className={styles.commentForm}
                      onSubmit={handleCommentSubmit}
                    >
                      <textarea
                        className={styles.commentInput}
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        rows={3}
                        required
                      />
                      <button
                        type="submit"
                        className={styles.commentButton}
                        disabled={isCommentPending}
                      >
                        {isCommentPending ? "Posting..." : "Post Comment"}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EventsDisplayWithComment />
    </Suspense>
  );
}
