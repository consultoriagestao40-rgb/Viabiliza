import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from 'next/link';
import {
    LayoutDashboard,
    Ticket,
    Users,
    BarChart3,
    Settings,
    LogOut,
    Bell,
    HardHat
} from "lucide-react";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
        redirect("/login");
    }

    const menuItems = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Chamados', href: '/admin/tickets', icon: Ticket },
        { name: 'Equipe Técnica', href: '/admin/technicians', icon: HardHat },
        { name: 'Clientes', href: '/admin/users', icon: Users },
        { name: 'Financeiro', href: '/admin/finance', icon: BarChart3 },
        { name: 'Configurações', href: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-primary-950 text-white flex-shrink-0 hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-primary-800">
                    <div className="h-8 w-8 bg-secondary-500 rounded flex items-center justify-center mr-3">
                        <span className="font-bold text-white">V</span>
                    </div>
                    <span className="text-lg font-bold tracking-tight">VIABILIZA</span>
                </div>

                <div className="flex-1 overflow-y-auto py-6">
                    <nav className="px-3 space-y-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-primary-100 hover:bg-primary-900 list-none"
                            >
                                <item.icon className="mr-3 h-5 w-5 flex-shrink-0 text-primary-400" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="p-4 border-t border-primary-800">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary-800 flex items-center justify-center text-sm font-medium">
                            {session.user?.name?.[0] || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{session.user?.name}</p>
                            <p className="text-xs text-primary-400 truncate">Administrador</p>
                        </div>
                        <Link href="/api/auth/signout">
                            <LogOut className="h-5 w-5 text-primary-400 hover:text-white cursor-pointer" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-6">
                    <h1 className="text-xl font-bold text-neutral-800 dark:text-white">Visão Geral</h1>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-neutral-500 hover:text-neutral-700">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
