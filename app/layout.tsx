import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
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
        className={`${manrope.variable} antialiased font-manrope`}
        style={{ backgroundColor: 'hsl(230, 100%, 99%)', color: 'hsl(227, 35%, 25%)' }}
      >
        {children}
      </body>
    </html>
  );
}
