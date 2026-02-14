import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FeedbackProvider } from "@/context/FeedbackContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Smart-Response HQ",
  description: "AI-powered email response analysis and drafting tool",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-primary-bg text-text-primary`}
      >
        <FeedbackProvider>{children}</FeedbackProvider>
      </body>
    </html>
  );
}
