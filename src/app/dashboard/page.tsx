import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
import Link from "next/link"
import { Plus, Clock, AlertTriangle, CheckCircle, Shield } from "lucide-react"

const prisma = new PrismaClient()

async function getTickets(userId: string) {
    return await prisma.ticket.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
            technician: {
                select: { name: true }
            }
        }
    })
}

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <p>Acesso negado. Faça login.</p>
                <Link href="/login" className="text-blue-600 underline">Ir para Login</Link>
            </div>
        )
    }

    const tickets = await getTickets(session.user.id)

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900">Meus Chamados</h1>
                    <p className="text-neutral-600">Acompanhe o status dos seus serviços.</p>
                </div>
                <div className="flex gap-3">
                    {session.user.role === 'ADMIN' && (
                        <Link
                            href="/admin"
                            className="flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 shadow-md"
                        >
                            <Shield className="h-4 w-4" /> Painel Admin
                        </Link>
                    )}
                    <Link
                        href="/chamados/novo"
                        className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-md"
                    >
                        <Plus className="h-4 w-4" /> Novo Chamado
                    </Link>
                </div>
            </div>

            {tickets.length === 0 ? (
                <div className="text-center py-16 bg-neutral-50 rounded-xl border border-dashed border-neutral-300">
                    <div className="mx-auto h-12 w-12 text-neutral-400 mb-4">
                        {/* Icon placeholder */}
                        <Clock className="h-full w-full" />
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-neutral-900">Nenhum chamado encontrado</h3>
                    <p className="mt-1 text-sm text-neutral-500">Comece solicitando um novo serviço.</p>
                    <div className="mt-6">
                        <Link
                            href="/chamados/novo"
                            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                        >
                            <Plus className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                            Novo Chamado
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {tickets.map(ticket => (
                        <Link href={`/chamados/${ticket.id}`} key={ticket.id} className="group block">
                            <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm group-hover:shadow-md transition-shadow cursor-pointer">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                        {ticket.serviceType}
                                    </span>
                                    <StatusBadge status={ticket.status} />
                                </div>
                                <h3 className="font-semibold text-neutral-900 mb-1 truncate">{ticket.description}</h3>
                                <p className="text-sm text-neutral-500 mb-2 truncate">{ticket.location}</p>

                                <div className="flex items-center justify-between mt-4 bg-neutral-50 p-3 rounded-lg">
                                    <div className="text-xs text-neutral-500">
                                        <div className="mb-1">Técnico</div>
                                        <div className="font-medium text-neutral-900">{ticket.technician?.name || '-'}</div>
                                    </div>
                                    <div className="text-xs text-neutral-500 text-right">
                                        <div className="mb-1">Valor</div>
                                        <div className="font-medium text-neutral-900">
                                            {ticket.value
                                                ? ticket.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                                : '-'
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-xs text-neutral-400 border-t pt-4 mt-4">
                                    <span>{new Date(ticket.createdAt).toLocaleDateString('pt-BR')}</span>
                                    <span>ID: {ticket.id.slice(-6)}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        OPEN: "bg-yellow-50 text-yellow-800 ring-yellow-600/20",
        QUOTED: "bg-blue-50 text-blue-800 ring-blue-600/20",
        SCHEDULED: "bg-purple-50 text-purple-800 ring-purple-600/20",
        IN_PROGRESS: "bg-orange-50 text-orange-800 ring-orange-600/20",
        COMPLETED: "bg-green-50 text-green-800 ring-green-600/20",
        CANCELED: "bg-red-50 text-red-800 ring-red-600/20",
    }[status] || "bg-gray-50 text-gray-600 ring-gray-500/10"

    const labels = {
        OPEN: "Aberto",
        QUOTED: "Orçado",
        SCHEDULED: "Agendado",
        IN_PROGRESS: "Em Andamento",
        COMPLETED: "Concluído",
        CANCELED: "Cancelado"
    }[status] || status

    return (
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${styles}`}>
            {labels}
        </span>
    )
}
