import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import type React from "react"; // Import React

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "bugoverflow",
  icons: {
    icon: "/favicon.svg",
  },
  description: "Collaborative Projects Finder",
  keywords: [
    "saas",
    "sofware",
    "open source",
    "coding",
    "bootcamp",
    "bugoverflow",
    "stackoverflow",
    "github",
    "junior",
    "developer",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={bricolageGrotesque.className}>
      <body className="antialiased">{children}</body>
    </html>
  );
}

console.log("✅ Next.js está ejecutando el layout");
