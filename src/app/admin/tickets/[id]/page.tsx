import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BadgeCheck, Calendar, MapPin, User, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const prisma = new PrismaClient();

async function getTicket(id: string) {
    return await prisma.ticket.findUnique({
        where: { id },
        include: {
            user: true,
            activities: {
                include: { user: true },
                orderBy: { createdAt: 'desc' }
            }
        }
    });
}



async function getTechnicians() {
    return await prisma.user.findMany({
        where: { role: 'TECHNICIAN' },
        select: { id: true, name: true, specialty: true }
    });
}

import TicketActions from "@/components/admin/TicketActions";
import TicketAssignment from "@/components/admin/TicketAssignment";
import ChatInterface from "@/components/admin/ChatInterface";
import TicketValue from "@/components/admin/TicketValue";
import TicketCostBox from "@/components/admin/TicketCostBox";
import ActivityTimeline from "@/components/admin/ActivityTimeline";


export default async function TicketDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const ticket = await getTicket(id);
    const technicians = await getTechnicians();

    if (!ticket) {
        notFound();
    }

    const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ticket.location)}`;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/tickets">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Detalhes do Chamado #{ticket.id.slice(-4)}</h2>
                    <p className="text-neutral-500">Visualização completa das informações.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">{ticket.serviceType}</h3>
                                <div className="flex items-center gap-2 text-sm text-neutral-500">
                                    <Calendar className="h-4 w-4" />
                                    {format(new Date(ticket.createdAt), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${ticket.status === 'OPEN' ? 'bg-blue-100 text-blue-700' :
                                ticket.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' :
                                    ticket.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                        ticket.status === 'SCHEDULED' ? 'bg-purple-100 text-purple-700' :
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
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-2">Descrição do Problema</h4>
                                <p className="text-neutral-600 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg">
                                    {ticket.description}
                                </p>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-2">Localização</h4>
                                <a
                                    href={mapLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-primary-600 hover:text-primary-800 hover:underline bg-primary-50 p-3 rounded-lg border border-primary-100 transition-colors"
                                >
                                    <MapPin className="h-5 w-5" />
                                    <span className="font-medium">{ticket.location}</span>
                                    <span className="text-xs text-primary-400 ml-auto">(Abrir no Maps)</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <ActivityTimeline
                        ticketId={ticket.id}
                        activities={ticket.activities}
                    />
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">Solicitante</h3>
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
                                {ticket.user?.name?.[0] || 'U'}
                            </div>
                            <div>
                                <p className="font-bold text-neutral-900 dark:text-white">{ticket.user?.name}</p>
                                <p className="text-sm text-neutral-500">{ticket.user?.email}</p>
                            </div>
                        </div>
                    </div>



                    <TicketValue
                        ticketId={ticket.id}
                        initialValue={ticket.value}
                    />

                    <TicketCostBox
                        displacementCost={ticket.displacementCost}
                        distanceKm={ticket.distanceKm}
                        durationMin={ticket.durationMin}
                    />

                    <TicketActions
                        ticketId={ticket.id}
                        currentStatus={ticket.status}
                        currentDate={ticket.scheduledDate ? new Date(ticket.scheduledDate).toISOString() : null}
                    />

                    <TicketAssignment
                        ticketId={ticket.id}
                        currentTechnicianId={ticket.technicianId}
                        technicians={technicians}
                    />

                    <ChatInterface ticketId={ticket.id} clientPhone={ticket.user?.phone} />
                </div>
            </div>
        </div >
    );
}
