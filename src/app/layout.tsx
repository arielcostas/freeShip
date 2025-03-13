// Modificar tu archivo layout.tsx (probablemente en app/layout.tsx)

"use client";

import { ThemeProvider } from "../app/context/ThemeContext";
import "../app/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
