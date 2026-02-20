import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";

// Google Font xatosi bo'lsa, uni import qilmasdan 
// quyidagi metadata va oddiy body klassidan foydalanamiz

export const metadata: Metadata = {
  title: "Admin CRM System",
  description: "Neo-brutalist Admin Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" suppressHydrationWarning>
      {/* 
        Google font xato bersa, body'ga 'font-sans' klassini bering. 
        Tailwind avtomatik ravishda Inter yoki tizim shriftini qo'yadi.
      */}
      <body className="antialiased font-sans" suppressHydrationWarning>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}