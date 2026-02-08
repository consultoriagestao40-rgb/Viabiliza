"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare } from "lucide-react";

export default function ChatInterface({ ticketId }: { ticketId: string }) {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // Polling every 5s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [messages]);

    async function fetchMessages() {
        try {
            const res = await fetch(`/api/tickets/${ticketId}/messages`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    async function handleSend() {
        if (!newMessage.trim()) return;

        try {
            const res = await fetch(`/api/tickets/${ticketId}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newMessage })
            });

            if (res.ok) {
                setNewMessage("");
                fetchMessages();
            }
        } catch (e) {
            alert("Erro ao enviar mensagem");
        }
    }

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 flex flex-col h-[500px]">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-green-600" />
                <h3 className="font-bold text-neutral-900 dark:text-white">Chat do Atendimento</h3>
                <span className="text-xs text-neutral-400 ml-auto">Via WhatsApp (Simulado)</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50 dark:bg-neutral-950/50">
                {messages.length === 0 && !loading && (
                    <div className="text-center text-neutral-400 text-sm mt-10">
                        Nenhuma mensagem ainda. Inicie a conversa.
                    </div>
                )}

                {messages.map((msg) => {
                    const isSystem = msg.senderType === 'SYSTEM';
                    const isMe = true; // Simplified for now, in real app compare session.user.id
                    // Actually we can check msg.senderId
                    // Let's rely on sender name for visual distinction for now

                    return (
                        <div key={msg.id} className={`flex flex-col ${isSystem ? 'items-center' : 'items-start'}`}>
                            {isSystem ? (
                                <span className="text-xs bg-neutral-200 text-neutral-600 px-2 py-1 rounded-full">{msg.content}</span>
                            ) : (
                                <div className="bg-white dark:bg-neutral-800 p-3 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 max-w-[80%]">
                                    <div className="text-xs font-bold text-neutral-900 dark:text-white mb-1">
                                        {msg.sender?.name || 'Usuário'}
                                        <span className="text-neutral-400 font-normal ml-2">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            )}
                        </div>
                    )
                })}
                <div ref={bottomRef} />
            </div>

            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Digite sua mensagem..."
                        className="flex-1 rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <Button onClick={handleSend} className="bg-green-600 hover:bg-green-700 text-white">
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
