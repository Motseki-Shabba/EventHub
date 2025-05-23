import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AttendeeProvider } from "@/Providers/Auth";
import { ConfigProvider } from "antd";
import { EventProvider } from "@/Providers/Event";
import { OrganizerProvider } from "@/Providers/Organizer";
import { CommentProvider } from "@/Providers/comments";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#734cab",
            colorInfo: "#734cab",
          },
        }}
      >
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <CommentProvider>
            <OrganizerProvider>
              <EventProvider>
                {" "}
                <AttendeeProvider>{children}</AttendeeProvider>
              </EventProvider>
            </OrganizerProvider>
          </CommentProvider>
        </body>
      </ConfigProvider>
    </html>
  );
}
