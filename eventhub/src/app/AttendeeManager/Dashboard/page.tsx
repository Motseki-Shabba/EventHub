"use client";
import { useAttendeeActions, useAttendeeState } from "@/Providers/Auth";
import React, { useEffect } from "react";

// App component wraps MainLayout with AttendeeProvider
const App: React.FC = () => {
  const { getCurrentUser } = useAttendeeActions();
  const { CurrentUser } = useAttendeeState();

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    debugger;
    if (token && CurrentUser === undefined) {
      getCurrentUser(token);
    }
    console.log("getCurrentUser", CurrentUser);
  }, [CurrentUser]);

  return <div>Testing</div>;
};

export default App;
