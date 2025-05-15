"use client";

import { useAttendeeActions, useAttendeeState } from "@/Providers/Auth";
import React, { useEffect } from "react";
import EventCharts from "./Charts/page";

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

  return <div>{<EventCharts />}</div>;
};

export default App;
