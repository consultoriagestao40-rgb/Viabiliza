import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, MapPin, User, Star } from "lucide-react";
import TicketRating from "@/components/client/TicketRating";

const prisma = new PrismaClient();

async function getTicket(id: string, userId: string) {
    return await prisma.ticket.findFirst({
        where: { id, userId },
        include: { technician: true }
    });
}

export default async function ClientTicketDetails({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");

    const { id } = await params;
    const ticket = await getTicket(id, session.user.id);

    if (!ticket) notFound();

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <Link href="/dashboard" className="inline-flex items-center text-neutral-500 hover:text-neutral-900 mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" /> Voltar para o Dashboard
            </Link>

            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                <div className="p-6 border-b border-neutral-100 bg-neutral-50">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-neutral-900">{ticket.serviceType}</h1>
                            <p className="text-sm text-neutral-500 mt-1">ID: {ticket.id}</p>
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
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <h3 className="font-semibold text-neutral-900 mb-2">Descrição</h3>
                        <p className="text-neutral-600 bg-neutral-50 p-4 rounded-lg">{ticket.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                                <User className="h-4 w-4" /> Técnico Responsável
                            </h3>
                            <div className="bg-neutral-50 p-4 rounded-lg">
                                {ticket.technician ? (
                                    <>
                                        <p className="font-medium text-neutral-900">{ticket.technician.name}</p>
                                        <p className="text-sm text-neutral-500">{ticket.technician.specialty || 'Técnico'}</p>
                                    </>
                                ) : (
                                    <p className="text-neutral-500 italic">Técnico ainda não atribuído</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                                <MapPin className="h-4 w-4" /> Local
                            </h3>
                            <div className="bg-neutral-50 p-4 rounded-lg text-neutral-600">
                                {ticket.location}
                            </div>
                        </div>
                    </div>

                    {(ticket.status === 'COMPLETED' && ticket.value) && (
                        <div className="border-t border-neutral-100 pt-6">
                            <div className="flex justify-between items-center text-lg">
                                <span className="font-semibold text-neutral-900">Total do Serviço</span>
                                <span className="font-bold text-green-600">
                                    {ticket.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                            </div>
                        </div>
                    )}

                    {ticket.status === 'COMPLETED' && (
                        <div className="border-t border-neutral-100 pt-6">
                            <h3 className="font-bold text-lg text-neutral-900 mb-4 flex items-center gap-2">
                                <Star className="h-5 w-5 text-yellow-500" /> Avaliar Serviço
                            </h3>
                            <TicketRating
                                ticketId={ticket.id}
                                initialRating={ticket.rating}
                                initialReview={ticket.review}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
