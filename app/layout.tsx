import type React from "react"
import type { Metadata } from "next"
import { Inter_Tight } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { AuthProvider } from "@/context/auth-context"
import { QueryProvider } from "@/context/query-context"

const inter_tight = Inter_Tight({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "SIM CUTI",
    description: "A comprehensive leave management system for employees and administrators",
    icons: {
        icon: "/logo/icon.png",
    }
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
      <html lang="en">
        <body className={inter_tight.className}>
          <AuthProvider>
            <QueryProvider>{children}</QueryProvider>
          </AuthProvider>
          <Toaster />
        </body>
      </html>
    );
}
