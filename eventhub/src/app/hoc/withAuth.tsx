"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRole } from "@/Utils/jwtDecoder";

interface LayoutProps {
  children?: React.ReactNode;
}

const withAuth = (WrappedLayout: React.ComponentType<LayoutProps>) => {
  const WithAuthWrapper: React.FC<LayoutProps> = ({ children, ...props }) => {
    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(true);

    useEffect(() => {
      const token = sessionStorage.getItem("accessToken");

      if (!token) {
        router.push("/");
        return;
      }

      try {
        const role = getRole(token);

        const roleRedirectMap: Record<string, string> = {
          ATTENDEE: "/AttendeeManager",
          ORGANIZER: "/OrganizerManager",
        };

        const destination = roleRedirectMap[role] || "/";
        router.push(destination);
      } catch (error) {
        console.error("Error decoding token:", error);
        router.push("/");
      } finally {
        setIsRedirecting(false);
      }
    }, [router]);

    if (isRedirecting) return null;

    return <WrappedLayout {...props}>{children}</WrappedLayout>;
  };

  return WithAuthWrapper;
};

export default withAuth;
