"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./page.module.css";

// interface Event {
//   id: number;
//   title: string;
//   date: string;
//   location: string;
//   category: string;
//   attendees: number;
// }

const EventHub = () => {
  // Sample event data
  const events = [
    {
      id: 1,
      title: "KUNYE",
      date: "June 15-17, 2025",
      location: "Johnnesburg, South Africa",
      category: "Music",
      attendees: 1500,
    },
    {
      id: 2,
      title: "Balcony Mix",
      date: "July 8-10, 2025",
      location: "The Dome, South Africa",
      category: "Music",
      attendees: 5000,
    },
    {
      id: 3,
      title: "Spring Festa",
      date: "August 25-27, 2025",
      location: "Durban, South Africa",
      category: "Music",
      attendees: 2200,
    },
  ];
  const categories = ["All", "Technology", "Music", "Food", "Business", "Arts"];
  const [filteredCategory, setFilteredCategory] = useState<string | null>(null);

  const handleFilterChange = (category: string | null) => {
    setFilteredCategory(category);
  };

  const filteredEvents = filteredCategory
    ? events.filter((event) => event.category === filteredCategory)
    : events;

  return (
    <div className={styles.eventHub}>
      {/* Header & Navbar */}
      <header className={styles.header}>
        <div className={styles.navbar}>
          <div className={styles.logo}>EventHub</div>
          <nav className={styles.navigation}>
            <Link href="/" className={styles.navLink}>
              Home
            </Link>
            <Link href="/events" className={styles.navLink}>
              Events
            </Link>
            <Link href="/about" className={styles.navLink}>
              About
            </Link>
            <Link href={"/Auth/Login"} className={styles.loginButton}>
              Login
            </Link>
          </nav>
        </div>

        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Discover. Create.{" "}
              <span className={styles.highlight}>Celebrate.</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Manage and attend events with ease, from anywhere in the world.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/events" className={styles.primaryButton}>
                Browse Events
              </Link>
              <Link href="/create" className={styles.secondaryButton}>
                Create Event
              </Link>
            </div>
          </div>
          <div className={styles.heroImage}>
            <Image
              src="/images/pic3.png"
              alt="People at event"
              width={600}
              height={400}
              priority
            />
          </div>
        </div>
      </header>
      {/* Events Section */}
      <section className={styles.eventsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Upcoming Events</h2>
          <p className={styles.sectionDescription}>
            Discover the hottest events happening near you. From tech
            conferences to music festivals, find something exciting for
            everyone.
          </p>
        </div>

        <div className={styles.filterContainer}>
          <h3 className={styles.filterHeading}>Filter by Category</h3>
          <div className={styles.categoryButtons}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  handleFilterChange(category === "All" ? null : category)
                }
                className={`${styles.categoryButton} ${
                  (category === "All" && !filteredCategory) ||
                  category === filteredCategory
                    ? styles.activeCategory
                    : ""
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.eventGrid}>
          {filteredEvents.map((event) => (
            <div key={event.id} className={styles.eventCard}>
              <div className={styles.eventImageContainer}>
                <Image
                  src={`/images/pic2.png`}
                  alt={event.title}
                  className={styles.eventImage}
                  width={400}
                  height={250}
                  objectFit="cover"
                />
                <span className={styles.eventBadge}>{event.category}</span>
              </div>

              <div className={styles.eventContent}>
                <h3 className={styles.eventTitle}>{event.title}</h3>

                <div className={styles.eventInfo}>
                  <div className={styles.eventInfoItem}>
                    <span className={styles.eventInfoIcon}>📅</span>
                    <span>{event.date}</span>
                  </div>

                  <div className={styles.eventInfoItem}>
                    <span className={styles.eventInfoIcon}>📍</span>
                    <span>{event.location}</span>
                  </div>

                  <div className={styles.eventInfoItem}>
                    <span className={styles.eventInfoIcon}>👥</span>
                    <span>{event.attendees} attending</span>
                  </div>
                </div>

                <Link
                  href={`/events/${event.id}`}
                  className={styles.eventButton}
                >
                  Get Tickets
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.viewAllContainer}>
          <Link href="/events" className={styles.viewAllButton}>
            View All Events
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.statsContainer}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>500+</div>
            <div className={styles.statLabel}>Events Monthly</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>20k+</div>
            <div className={styles.statLabel}>Active Users</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>100+</div>
            <div className={styles.statLabel}>Cities Covered</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>98%</div>
            <div className={styles.statLabel}>Satisfaction Rate</div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Ready to Get Started?</h2>
        <p className={styles.ctaDescription}>
          Join thousands of event organizers and attendees on our platform.
        </p>
        <div className={styles.ctaButtons}>
          <Link href="/register" className={styles.ctaPrimaryButton}>
            Sign Up Free
          </Link>
          <Link href="/contact" className={styles.ctaSecondaryButton}>
            Contact Sales
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>EventHub</div>
          <p className={styles.footerCopyright}>
            &copy; {new Date().getFullYear()} EventHub. All rights reserved.
          </p>
          <div className={styles.footerLinks}>
            <Link href="/terms" className={styles.footerLink}>
              Terms
            </Link>
            <Link href="/privacy" className={styles.footerLink}>
              Privacy
            </Link>
            <Link href="/contact" className={styles.footerLink}>
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EventHub;
