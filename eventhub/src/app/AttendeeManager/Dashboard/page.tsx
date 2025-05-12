"use client";
// import OrganizerManagement from "@/app/OrganizerManager/Dashboard/page";
import { useAttendeeActions, useAttendeeState } from "@/Providers/Auth";
import EventManagement from "@/app/Components/Event/page";
import React, { useEffect } from "react";

// App component wraps MainLayout with AttendeeProvider
const App: React.FC = () => {
  const { getCurrentUser } = useAttendeeActions();
  const { CurrentUser } = useAttendeeState();

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");

    if (token && CurrentUser === undefined) {
      getCurrentUser(token);
    }
    console.log("getCurrentUser", CurrentUser);
  }, [CurrentUser]);

  return (
    <div>
      <EventManagement />
      {/* {<OrganizerManagement />} */}
      {/* {<EventsDisplay />} */}
    </div>
  );
};

export default App;
