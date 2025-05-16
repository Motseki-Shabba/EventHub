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

**Project Plan**

https://boxfusionint-my.sharepoint.com/:w:/g/personal/motseki_tshabalala_boxfusion_io/ER2jl3hTnl5DplJn-7a5vIEBQFpnxRkuqAzL8tzIMUNXtQ?e=PrkEmS

Event - Contains details about date, location, organizer, tickets, and attendees
Organizer - Users who create and manage events
Attendee - Users who register for and attend events
Ticket - Defines access types, pricing, and availability for events

**Designs**


https://lucid.app/lucidchart/78118882-bfea-4eff-bd49-f792941d1a5a/edit?page=0_0&invitationId=inv_def19bee-ba7d-44ec-9069-296c3557e073#

**Access Link**


https://event-hub-s9mk.vercel.app

**Login Credentials**


Attendee Username: Shabba
Password: 123456789@Test

Organizer Username: Lihlumise
Password: 123456789@Test


**Key Relationships**

Organizer ↔ Events: 1-to-Many
Event ↔ Attendee: Many-to-Many
Event ↔ Ticket: 1-to-Many
Notification ↔ Event & Attendee: Many-to-One

**🚀 Project Structure**

EventHub/

├── aspnet-core/        
└── eventhub/   

NextJs
Abp Boilerplate
Docker 

**Installation**
bash# Clone the repository
(https://github.com/Motseki-Shabba/EventHub.git)

# Navigate to project directory
cd EventHub

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

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
