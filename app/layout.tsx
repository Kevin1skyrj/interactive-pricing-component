import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600", "800"],
});

export const metadata: Metadata = {
  title: "Interactive Pricing Component",
  description: "A simple interactive pricing component with slider",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.className} antialiased`}
        style={{
          backgroundColor: 'var(--bg-color, #fefefe)',
          color: 'var(--text-color, #1e293b)',
          transition: 'background-color 0.3s ease, color 0.3s ease',
        }}
      >
        {children}
      </body>
    </html>
  );
}
