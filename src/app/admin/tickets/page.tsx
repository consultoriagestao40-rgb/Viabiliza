import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BadgeCheck, Clock, AlertCircle } from "lucide-react";

// In a real app, use a singleton for Prisma
const prisma = new PrismaClient();

async function getTickets() {
    // Avoid instantiation in render if possible, but for MVP server component this is 'okay'ish 
    // though typically we use the centralized lib/db inst.
    // Re-importing here to be safe with the script context. 
    // Actually, let's use the global prisma if available or import from lib if I had created it properly. 
    // I will just use new Client here for the page for now or better yet, if I have `src/lib/prisma.ts`? 
    // Checking file structure... I likely don't have a centralized prisma lib yet, so I'll instantiate.
    return await prisma.ticket.findMany({
        include: {
            user: true,
            technician: {
                select: {
                    name: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}

export default async function AdminTicketsPage() {
    const tickets = await getTickets();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Gerenciar Chamados</h2>
                    <p className="text-neutral-500">Visualize e despache os serviços solicitados.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-neutral-50 dark:bg-neutral-800 text-neutral-500 font-medium border-b border-neutral-200 dark:border-neutral-700">
                            <tr>
                                <th className="px-6 py-4">Data</th>
                                <th className="px-6 py-4">Cliente</th>
                                <th className="px-6 py-4">Serviço</th>
                                <th className="px-6 py-4">Técnico</th>
                                <th className="px-6 py-4">Local</th>
                                <th className="px-6 py-4">Urgência</th>
                                <th className="px-6 py-4">Valor</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                            {tickets.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-neutral-500">
                                        Nenhum chamado encontrado.
                                    </td>
                                </tr>
                            ) : (
                                tickets.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                        <td className="px-6 py-4 text-neutral-500">
                                            {format(new Date(ticket.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">
                                            {ticket.user?.name || 'Sem nome'}
                                            <div className="text-xs text-neutral-400 font-normal">{ticket.user?.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700 border border-primary-100">
                                                {ticket.serviceType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {ticket.technician?.name ? (
                                                <span className="text-neutral-900 dark:text-white font-medium">{ticket.technician.name}</span>
                                            ) : (
                                                <span className="text-neutral-400 italic">-- Pendente --</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-neutral-600 max-w-[200px] truncate" title={ticket.location}>
                                            {ticket.location}
                                        </td>
                                        <td className="px-6 py-4">
                                            {ticket.urgency === 'Emergência' ? (
                                                <span className="text-red-600 font-bold flex items-center gap-1">
                                                    <AlertCircle className="h-4 w-4" /> Emergência
                                                </span>
                                            ) : (
                                                <span className="text-neutral-600">{ticket.urgency || 'Normal'}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {ticket.value ? (
                                                <span className="text-neutral-900 dark:text-white font-mono">
                                                    {ticket.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                </span>
                                            ) : (
                                                <span className="text-neutral-400 text-xs">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${ticket.status === 'OPEN' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                ticket.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                    ticket.status === 'COMPLETED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                        ticket.status === 'SCHEDULED' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                                            'bg-neutral-100 text-neutral-700'
                                                }`}>
                                                {
                                                    ticket.status === 'OPEN' ? 'Aberto' :
                                                        ticket.status === 'IN_PROGRESS' ? 'Em Andamento' :
                                                            ticket.status === 'COMPLETED' ? 'Concluído' :
                                                                ticket.status === 'SCHEDULED' ? 'Agendado' :
                                                                    ticket.status === 'CANCELED' ? 'Cancelado' : ticket.status
                                                }
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link href={`/admin/tickets/${ticket.id}`}>
                                                <button className="text-primary-600 hover:text-primary-800 font-medium text-sm">
                                                    Detalhes
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
