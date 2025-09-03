import type { Metadata } from "next";
import { Roboto } from 'next/font/google';
import "./globals.css";
import TopBar from "@/components/web/topbar";

const roboto = Roboto({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Material CN",
  description: "A Material Design component library for React based on Shadcn.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)
{
  return (
    <html lang="en">
      <body
        className={`antialiased ${roboto.className}`}
      >
        <TopBar />
        {children}
      </body>
    </html>
  );
}
