import type { Metadata } from "next";
import { Roboto } from 'next/font/google';
import "./globals.css";
import TopBar from "@/components/web/topbar";
import Sidebar from "@/components/web/sidebar";

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
        className={`antialiased ${roboto.className} bg-background`}
      >
        <div className="flex flex-col h-screen">
          <TopBar />
          <main className="flex-1 flex overflow-hidden px-4">
            <Sidebar />

            <div className="flex-grow p-6 rounded-4xl bg-accent">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
