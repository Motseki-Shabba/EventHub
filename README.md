**EventHub** 
is a comprehensive event management platform that connects event organizers with attendees. Create, manage, and promote events while providing seamless registration and ticketing experiences.

**✨ Features**
🧑‍💼 For Organizers

📝 Create and manage detailed event listings
🎟️ Customize multiple ticket types (General, VIP, etc.)
📊 Real-time analytics on registrations and attendance
📤 Export attendee data for offline management
📅 Google Calendar synchronization
📣 Send automated notifications to attendees

**👥 For Attendees**

🔍 Browse and discover upcoming events
💳 Register and purchase tickets
📱 Receive email/SMS notifications
📆 Add events to personal calendar
⭐ Submit post-event feedback

**🏗️ Architecture**
Domain Model
The platform is structured around these core entities:

Event - Contains details about date, location, organizer, tickets, and attendees
Organizer - Users who create and manage events
Attendee - Users who register for and attend events
Ticket - Defines access types, pricing, and availability for events


**Key Relationships**

Organizer ↔ Events: 1-to-Many
Event ↔ Attendee: Many-to-Many
Event ↔ Ticket: 1-to-Many
Notification ↔ Event & Attendee: Many-to-One

🚀 Getting Started
Prerequisites

NextJs
Abp Boilerplate
Docker 

**Installation**
bash# Clone the repository
(https://github.com/Motseki-Shabba/EventHub.git)

# Navigate to project directory
cd eventsphere

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npm run migrate

# Start the development server
npm run dev
🛣️ Roadmap
PhaseFocus AreaStatus1Event creation, attendee RSVP, organizer dashboard🟡 In Progress2Ticket management & payment integration🔜 Planned3Calendar sync, real-time analytics, notifications🔜 Planned4Documentation, multi-device testing🔜 Planned
🧪 Testing
bash# Run test suite
npm test

# Run with coverage report
npm run test:coverage
🔧 Tech Stack

Frontend: NextJs
Backend: Abp Boilerplate
Database: SQL Server
Authentication: JWT
Payment Processing: PayFast

Deployment: Docker, Render/Supabase

📚 Documentation

Setup Guide for Organizers
User Manual for Attendees
API Documentation
Contributing Guidelines

👨‍💻 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
