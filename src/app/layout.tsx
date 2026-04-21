import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Romeo & Juliet - Admin Portal",
  description: "Full-stack Next.js admin portal demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
