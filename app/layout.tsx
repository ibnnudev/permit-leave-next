import type React from "react"
import type { Metadata } from "next"
import { Inter_Tight } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

const inter_tight = Inter_Tight({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Employee Leave Management System",
    description: "A comprehensive leave management system for employees and administrators",
    generator: 'v0.dev'
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter_tight.className}>
                {children}
                <Toaster />
            </body>
        </html>
    )
}
