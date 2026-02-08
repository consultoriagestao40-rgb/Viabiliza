'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Clock, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

interface TicketActionsProps {
    ticketId: string;
    currentStatus: string;
    currentDate?: string | null;
}

export default function TicketActions({ ticketId, currentStatus, currentDate }: TicketActionsProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isScheduling, setIsScheduling] = useState(false);
    const [scheduleDate, setScheduleDate] = useState(currentDate ? new Date(currentDate).toISOString().slice(0, 16) : "");

    const statusMap: Record<string, string> = {
        'OPEN': 'Aberto',
        'IN_PROGRESS': 'Em Andamento',
        'COMPLETED': 'Concluído',
        'CANCELED': 'Cancelado'
    };

    const [value, setValue] = useState("");
    const [showValueInput, setShowValueInput] = useState(false);

    async function updateStatus(newStatus: string) {
        if (newStatus === 'COMPLETED' && !showValueInput) {
            setShowValueInput(true);
            return;
        }

        setLoading(true);
        try {
            const body: any = { status: newStatus };
            if (newStatus === 'COMPLETED' && value) {
                body.value = value;
            }

            await fetch(`/api/tickets/${ticketId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            setShowValueInput(false);
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Erro ao atualizar status");
        } finally {
            setLoading(false);
        }
    }

    async function handleSchedule() {
        setLoading(true);
        try {
            await fetch(`/api/tickets/${ticketId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scheduledDate: scheduleDate,
                    status: 'SCHEDULED' // Auto update status to scheduled
                })
            });
            setIsScheduling(false);
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Erro ao agendar");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            {/* Status Actions */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">Gerenciar Status</h3>

                {showValueInput ? (
                    <div className="space-y-4 mb-4 bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Valor do Serviço (R$)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="0,00"
                            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                        />
                        <div className="flex flex-col gap-2">
                            <Button
                                onClick={() => updateStatus('COMPLETED')}
                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                                disabled={!value || loading}
                            >
                                Confirmar Conclusão & Gerar Receita
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setShowValueInput(false)}
                                className="w-full"
                            >
                                Cancelar
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            variant={currentStatus === 'IN_PROGRESS' ? "default" : "outline"}
                            onClick={() => updateStatus('IN_PROGRESS')}
                            disabled={loading || currentStatus === 'IN_PROGRESS'}
                            className="w-full justify-start"
                        >
                            <Clock className="mr-2 h-4 w-4" /> Em Andamento
                        </Button>
                        <Button
                            variant={currentStatus === 'COMPLETED' ? "default" : "outline"}
                            onClick={() => updateStatus('COMPLETED')}
                            disabled={loading || currentStatus === 'COMPLETED'}
                            className="w-full justify-start hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                        >
                            <CheckCircle className="mr-2 h-4 w-4" /> Concluir
                        </Button>
                    </div>
                )}
            </div>

            {/* Schedule Action */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">Agendamento</h3>

                {isScheduling ? (
                    <div className="space-y-4">
                        <input
                            type="datetime-local"
                            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm"
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                        />
                        <div className="flex gap-2">
                            <Button onClick={handleSchedule} disabled={loading} className="flex-1 bg-primary-600">
                                Confirmar
                            </Button>
                            <Button variant="ghost" onClick={() => setIsScheduling(false)} disabled={loading} className="flex-1">
                                Cancelar
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {currentDate && (
                            <div className="flex items-center gap-2 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg text-sm text-neutral-600 dark:text-neutral-300">
                                <Calendar className="h-4 w-4 text-primary-500" />
                                Agendado para: <strong>{new Date(currentDate).toLocaleString('pt-BR')}</strong>
                            </div>
                        )}
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setIsScheduling(true)}
                        >
                            {currentDate ? 'Reagendar Visita' : 'Agendar Visita'}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
