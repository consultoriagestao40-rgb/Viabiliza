import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { Calendar, CheckCircle, Clock, MapPin, DollarSign, Wrench } from "lucide-react";

const prisma = new PrismaClient();

async function getTechnicianStats(userId: string) {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Fetch assigned tickets
    const tickets = await prisma.ticket.findMany({
        where: { technicianId: userId },
        orderBy: { scheduledDate: 'asc' }, // Nearest dates first
        include: { user: true }
    });

    // Calculate Earnings (Completed tickets this month)
    const completedMonth = tickets.filter(t =>
        t.status === 'COMPLETED' &&
        t.value &&
        new Date(t.updatedAt) >= startOfMonth
    );
    const earnings = completedMonth.reduce((acc, t) => acc + (t.value || 0), 0);

    // Calculate Average Rating
    const ratedTickets = tickets.filter(t => t.rating);
    const avgRating = ratedTickets.length > 0
        ? ratedTickets.reduce((acc, t) => acc + (t.rating || 0), 0) / ratedTickets.length
        : 0;

    return { tickets, earnings, avgRating, totalCompleted: completedMonth.length };
}

export default async function TechnicianDashboard() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'TECHNICIAN') {
        redirect('/'); // Or /login
    }

    const { tickets, earnings, avgRating, totalCompleted } = await getTechnicianStats(session.user.id);

    const nextAppointments = tickets.filter(t => t.status === 'SCHEDULED' || t.status === 'IN_PROGRESS');
    const pastAppointments = tickets.filter(t => t.status === 'COMPLETED');

    return (
        <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Espaço do Técnico</h1>
                    <p className="text-neutral-500">Bem-vindo, {session.user.name}.</p>
                </div>
                <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    {session.user.specialty || 'Generalista'}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                            <DollarSign className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500">Faturamento Mês</p>
                            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                                {earnings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <CheckCircle className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500">Serviços Concluídos (Mês)</p>
                            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">{totalCompleted}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                            <Clock className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500">Próximos Agendamentos</p>
                            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">{nextAppointments.length}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Next Appointments List */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Minha Agenda</h2>
                {nextAppointments.length === 0 ? (
                    <div className="text-center py-12 bg-neutral-50 rounded-xl border border-dashed border-neutral-300">
                        <p className="text-neutral-500">Nenhum serviço agendado para os próximos dias.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {nextAppointments.map(ticket => (
                            <Link href={`/admin/tickets/${ticket.id}`} key={ticket.id}>
                                <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-all cursor-pointer group">
                                    <div className="flex flex-col md:flex-row justify-between gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${ticket.status === 'IN_PROGRESS' ? 'bg-orange-100 text-orange-800' : 'bg-purple-100 text-purple-800'
                                                    }`}>
                                                    {ticket.status === 'IN_PROGRESS' ? 'Em Andamento' : 'Agendado'}
                                                </span>
                                                <span className="text-sm text-neutral-400 font-mono">#{ticket.id.slice(-6)}</span>
                                            </div>
                                            <h3 className="font-bold text-lg text-neutral-900 group-hover:text-primary-600 transition-colors">
                                                {ticket.serviceType} - {ticket.user?.name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-neutral-500 text-sm">
                                                <MapPin className="h-4 w-4" />
                                                {ticket.location}
                                            </div>
                                        </div>

                                        <div className="flex flex-row md:flex-col items-center md:items-end gap-2 md:gap-1 text-sm text-neutral-500">
                                            <div className="flex items-center gap-2 bg-neutral-50 px-3 py-2 rounded-lg">
                                                <Calendar className="h-4 w-4 text-primary-500" />
                                                <span className="font-medium text-neutral-900">
                                                    {ticket.scheduledDate
                                                        ? format(new Date(ticket.scheduledDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                                                        : 'Data pendente'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Note: In a real app we would have a 'History' tab or section here */}
        </div>
    );
}
