"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Menu, X, LogOut, User, Settings, Building2 } from "lucide-react"
import { Institution, Employee, Role } from "@prisma/client"

interface NavbarProps {
    user: Employee & {
        institution: Institution
    }
}

export function Navbar({ user }: NavbarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const router = useRouter()

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" })
        router.push("/login")
    }

    const getNavItems = () => {
        if (user.role == Role.SUPERADMIN) {
            return [
                { href: "/superadmin/dashboard", label: "Dashboard" },
                { href: "/superadmin/lembaga", label: "Kelola Lembaga" },
                { href: "/superadmin/users", label: "Kelola Pengguna" },
                { href: "/superadmin/jenis-cuti", label: "Jenis Cuti" },
                { href: "/superadmin/approval-flow", label: "Alur Persetujuan" },
            ]
        } else if (user.role == Role.ADMIN) {
            return [
                { href: "/admin/dashboard", label: "Dashboard" },
                { href: "/admin/leave-requests", label: "Kelola Cuti" },
                { href: "/admin/employees", label: "Karyawan" },
            ]
        } else {
            return [
                { href: "/dashboard", label: "Dashboard" },
                { href: "/cuti", label: "Cuti Saya" },
                { href: "/cuti/new", label: "Ajukan Cuti" },
            ]
        }
    }

    const getDashboardLink = () => {
        if (user.role == Role.SUPERADMIN) return "/superadmin/dashboard"
        if (user.role == Role.ADMIN) return "/admin/dashboard"
        return "/dashboard"
    }

    const navItems = getNavItems()

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href={getDashboardLink()} className="flex items-center space-x-2">
                            <h1 className="text-xl font-bold text-gray-900">Sistem Cuti</h1>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:ml-6 md:flex md:space-x-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                        </Button>

                        {/* User Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <div className="flex items-center justify-start gap-2 p-2">
                                    <div className="flex flex-col space-y-1 leading-none">
                                        <p className="font-medium">{user.name}</p>
                                        <p className="w-[200px] truncate text-sm text-muted-foreground">{user.personal_email}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {user.role == Role.SUPERADMIN ? "Super Admin" : user.role == Role.ADMIN ? "Admin" : "Karyawan"}
                                            {user.institution.name && ` • ${user.institution.name}`}
                                        </p>
                                    </div>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profil</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Pengaturan</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Keluar</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-gray-500 hover:text-gray-700 block px-3 py-2 rounded-md text-base font-medium"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
