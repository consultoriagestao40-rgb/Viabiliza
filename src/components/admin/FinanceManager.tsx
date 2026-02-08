'use client';

import { useState, useEffect } from 'react';
import {
    ArrowUpCircle,
    ArrowDownCircle,
    DollarSign,
    Filter,
    Plus,
    MoreHorizontal,
    Pencil,
    Trash2,
    X
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { motion, AnimatePresence } from 'framer-motion';

// Mocking UI components if they don't exist, but I'll try to build a contained component
function SimpleModal({ isOpen, onClose, title, children }: any) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl w-full max-w-md p-6 m-4"
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{title}</h3>
                    <button onClick={onClose}><X className="h-5 w-5 text-neutral-500" /></button>
                </div>
                {children}
            </motion.div>
        </div>
    )
}

export default function FinanceManager() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [stats, setStats] = useState({ revenue: 0, expenses: 0, balance: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    const [formData, setFormData] = useState({
        description: '',
        category: '',
        amount: '',
        type: 'OUT',
        status: 'PAID',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchTransactions();
    }, []);

    async function fetchTransactions() {
        try {
            const res = await fetch('/api/finance');
            const data = await res.json();
            if (Array.isArray(data)) {
                setTransactions(data);
                calculateStats(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }

    function calculateStats(data: any[]) {
        const rev = data.filter(t => t.type === 'IN').reduce((acc, curr) => acc + curr.amount, 0);
        const exp = data.filter(t => t.type === 'OUT').reduce((acc, curr) => acc + curr.amount, 0);
        setStats({ revenue: rev, expenses: exp, balance: rev - exp });
    }

    function handleOpenModal(item?: any) {
        if (item) {
            setEditingItem(item);
            setFormData({
                description: item.description,
                category: item.category,
                amount: item.amount.toString(),
                type: item.type,
                status: item.status,
                date: item.date ? item.date.split('T')[0] : new Date().toISOString().split('T')[0]
            });
        } else {
            setEditingItem(null);
            setFormData({
                description: '',
                category: '',
                amount: '',
                type: 'OUT',
                status: 'PAID',
                date: new Date().toISOString().split('T')[0]
            });
        }
        setIsModalOpen(true);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const payload = { ...formData, amount: parseFloat(formData.amount) };

        if (editingItem) {
            await fetch('/api/finance', {
                method: 'PUT',
                body: JSON.stringify({ id: editingItem.id, ...payload })
            });
        } else {
            await fetch('/api/finance', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
        }
        setIsModalOpen(false);
        fetchTransactions();
    }

    async function handleDelete(id: string) {
        if (!confirm('Tem certeza?')) return;
        await fetch(`/api/finance?id=${id}`, { method: 'DELETE' });
        fetchTransactions();
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Financeiro</h2>
                    <p className="text-neutral-500">Gestão de Contas a Pagar e Receber.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50">
                        <Filter className="h-4 w-4" /> Filtros
                    </button>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-primary-500/20"
                    >
                        <Plus className="h-4 w-4" /> Nova Transação
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FinanceCard
                    title="Receita Total"
                    value={stats.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    trend="Entradas"
                    icon={ArrowUpCircle}
                    color="text-emerald-500"
                    bg="bg-emerald-500/10"
                />
                <FinanceCard
                    title="Despesas"
                    value={stats.expenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    trend="Saídas"
                    icon={ArrowDownCircle}
                    color="text-red-500"
                    bg="bg-red-500/10"
                />
                <FinanceCard
                    title="Saldo Líquido"
                    value={stats.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    trend="Balanço"
                    icon={DollarSign}
                    color="text-primary-500"
                    bg="bg-primary-500/10"
                />
            </div>

            {/* Transactions Table */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800">
                <div className="border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 flex items-center justify-between">
                    <h3 className="font-bold text-neutral-900 dark:text-white">Transações Recentes</h3>
                </div>
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="p-8 text-center text-neutral-500">Carregando...</div>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 font-medium">
                                <tr>
                                    <th className="px-6 py-3">Descrição</th>
                                    <th className="px-6 py-3">Categoria</th>
                                    <th className="px-6 py-3">Data</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Valor</th>
                                    <th className="px-6 py-3">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {transactions.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-center py-6 text-neutral-500">Nenhuma transação encontrada.</td>
                                    </tr>
                                )}
                                {transactions.map((item) => (
                                    <tr key={item.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                        <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">{item.description}</td>
                                        <td className="px-6 py-4 text-neutral-500">{item.category}</td>
                                        <td className="px-6 py-4 text-neutral-500">{new Date(item.date).toLocaleDateString('pt-BR')}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'PAID' ? 'bg-green-100 text-green-700' :
                                                item.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-neutral-100 text-neutral-700'
                                                }`}>
                                                {item.status === 'PAID' ? 'Pago' : item.status === 'PENDING' ? 'Pendente' : item.status}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 text-right font-bold ${item.type === 'IN' ? 'text-emerald-600' : 'text-red-500'
                                            }`}>
                                            {item.type === 'IN' ? '+' : '-'} {item.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleOpenModal(item)} className="text-neutral-400 hover:text-primary-600">
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="text-neutral-400 hover:text-red-600">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <SimpleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Editar Transação' : 'Nova Transação'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Descrição</label>
                        <input
                            type="text"
                            required
                            className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Valor (R$)</label>
                            <input
                                type="number"
                                required
                                step="0.01"
                                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2"
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Data</label>
                            <input
                                type="date"
                                required
                                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Tipo</label>
                            <select
                                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="IN">Receita (Entrada)</option>
                                <option value="OUT">Despesa (Saída)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Status</label>
                            <select
                                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2"
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="PAID">Pago / Recebido</option>
                                <option value="PENDING">Pendente</option>
                                <option value="SCHEDULED">Agendado</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Categoria</label>
                        <input
                            type="text"
                            list="categories"
                            className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            placeholder="Ex: Material, Serviço, Aluguel"
                        />
                        <datalist id="categories">
                            <option value="Serviço" />
                            <option value="Material" />
                            <option value="Mão de Obra" />
                            <option value="Operacional" />
                            <option value="Marketing" />
                        </datalist>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-bold">
                            {editingItem ? 'Salvar Alterações' : 'Criar Transação'}
                        </Button>
                    </div>
                </form>
            </SimpleModal>
        </div>
    );
}

function FinanceCard({ title, value, trend, icon: Icon, color, bg }: any) {
    return (
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 flex items-center gap-4">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${bg} ${color}`}>
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <p className="text-sm font-medium text-neutral-500">{title}</p>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">{value}</h3>
                <span className="text-xs font-bold text-neutral-500">
                    {trend}
                </span>
            </div>
        </div>
    )
}
