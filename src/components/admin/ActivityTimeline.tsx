"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MessageSquare, Calendar, Paperclip, Phone, Mail, CheckCircle, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

interface Activity {
    id: string;
    type: string;
    content: string;
    date: string | Date | null;
    createdAt: string | Date;
    done: boolean;
    user: { name: string | null };
}

interface ActivityTimelineProps {
    ticketId: string;
    activities: Activity[];
}

export default function ActivityTimeline({ ticketId, activities }: ActivityTimelineProps) {
    const router = useRouter();
    const [isAdding, setIsAdding] = useState(false);
    const [type, setType] = useState('NOTE');
    const [content, setContent] = useState("");
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            await fetch(`/api/tickets/${ticketId}/activities`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type, content, date: date || null })
            });
            setIsAdding(false);
            setContent("");
            setDate("");
            router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function toggleDone(activityId: string, currentStatus: boolean) {
        try {
            await fetch(`/api/tickets/${ticketId}/activities/${activityId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ done: !currentStatus })
            });
            router.refresh();
        } catch (error) {
            console.error(error);
        }
    }

    const typeIcons: any = {
        NOTE: <MessageSquare className="h-4 w-4" />,
        CALL: <Phone className="h-4 w-4" />,
        EMAIL: <Mail className="h-4 w-4" />,
        MEETING: <Calendar className="h-4 w-4" />,
        ATTACHMENT: <Paperclip className="h-4 w-4" />,
    };

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Histórico & Atividades</h3>
                <Button size="sm" onClick={() => setIsAdding(!isAdding)} variant="outline">
                    + Nova Atividade
                </Button>
            </div>

            {isAdding && (
                <form onSubmit={handleSubmit} className="mb-6 bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-neutral-500 uppercase">Tipo</label>
                            <select
                                className="w-full mt-1 rounded-md border border-neutral-300 px-3 py-2 text-sm"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value="NOTE">Anotação</option>
                                <option value="CALL">Ligação</option>
                                <option value="EMAIL">Email</option>
                                <option value="MEETING">Reunião</option>
                                <option value="ATTACHMENT">Anexo (Link)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-neutral-500 uppercase">Data (Opcional)</label>
                            <input
                                type="datetime-local"
                                className="w-full mt-1 rounded-md border border-neutral-300 px-3 py-2 text-sm"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-neutral-500 uppercase">Descrição / Link</label>
                        <textarea
                            className="w-full mt-1 rounded-md border border-neutral-300 px-3 py-2 text-sm"
                            rows={3}
                            placeholder="Descreva a atividade..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancelar</Button>
                        <Button type="submit" disabled={loading} className="bg-primary-600 text-white">Salvar</Button>
                    </div>
                </form>
            )}

            <div className="space-y-6">
                {activities.length === 0 ? (
                    <p className="text-center text-neutral-400 text-sm">Nenhuma atividade registrada.</p>
                ) : (
                    activities.map((activity, index) => (
                        <div key={activity.id} className="relative pl-6 border-l-2 border-neutral-200 dark:border-neutral-800 pb-2 last:pb-0">
                            <div className="absolute -left-[9px] top-0 bg-white dark:bg-neutral-900 p-1 rounded-full border border-neutral-200 dark:border-neutral-700">
                                {typeIcons[activity.type] || <MessageSquare className="h-3 w-3" />}
                            </div>

                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold text-neutral-900 dark:text-white uppercase">{activity.type}</span>
                                        <span className="text-xs text-neutral-400">• {format(new Date(activity.createdAt), "dd/MM HH:mm")}</span>
                                        <span className="text-xs text-neutral-400">• {activity.user?.name}</span>
                                    </div>
                                    <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">{activity.content}</p>

                                    {activity.date && (
                                        <div className={`mt-2 flex items-center gap-2 text-xs px-2 py-1 rounded w-fit ${activity.done ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            <Calendar className="h-3 w-3" />
                                            <span>Para: {format(new Date(activity.date), "dd/MM/yyyy HH:mm")}</span>
                                        </div>
                                    )}
                                </div>

                                {(activity.type === 'CALL' || activity.type === 'MEETING' || activity.type === 'EMAIL') && (
                                    <button
                                        onClick={() => toggleDone(activity.id, activity.done)}
                                        className={`p-1 rounded-full hover:bg-neutral-100 ${activity.done ? 'text-green-600' : 'text-neutral-300'
                                            }`}
                                    >
                                        <CheckCircle className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
