'use client';

import { useState, useEffect } from 'react';
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Mail, User, Shield, Calendar, Search, MoreVertical, Trash2, Ban, CheckCircle, PenBox } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';

interface UserData {
    id: string;
    name: string | null;
    email: string;
    role: string;
    active: boolean;
    createdAt: string;
    _count: {
        tickets: number;
    }
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Edit Modal State
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<UserData | null>(null);
    const [editRole, setEditRole] = useState("");
    const [editActive, setEditActive] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/debug-users'); // We'll assume a route exists or create one. Actually, let's just use the server action approach or fetch from a new endpoint. 
            // Wait, I need a GET endpoint.
            // Let's create a quick action or use a GET route.
            // For now, let's fetch from the one I created or verify if there is one. 
            // The previous page was Server Component. I should keep it Server Component and use a Client Component for the list.
            // But to make "Edit" works dynamically without refresh, Client Component is easier.
            // Let's implement fetch inside.
            const response = await fetch('/api/admin/users-list'); // I will create this route next
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Failed to fetch", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openEditModal = (user: UserData) => {
        setCurrentUser(user);
        setEditRole(user.role);
        setEditActive(user.active ?? true);
        setIsEditOpen(true);
    };

    const handleUpdateUser = async () => {
        if (!currentUser) return;

        try {
            const res = await fetch(`/api/users/${currentUser.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: editRole, active: editActive })
            });

            if (res.ok) {
                toast.success("Usuário atualizado com sucesso!");
                setUsers(users.map(u => u.id === currentUser.id ? { ...u, role: editRole, active: editActive } : u));
                setIsEditOpen(false);
            } else {
                toast.error("Erro ao atualizar usuário.");
            }
        } catch (err) {
            toast.error("Erro desconhecido.");
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("Tem certeza que deseja EXCLUIR este usuário permanentemente?")) return;

        try {
            const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success("Usuário excluído.");
                setUsers(users.filter(u => u.id !== userId));
            } else {
                toast.error("Erro ao excluir.");
            }
        } catch (err) {
            toast.error("Erro desconhecido.");
        }
    };


    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Gestão de Clientes</h2>
                    <p className="text-neutral-500">Visualize e gerencie os usuários registrados.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input
                        type="text"
                        placeholder="Buscar cliente..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="pl-10 w-64"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-neutral-50 dark:bg-neutral-800 text-neutral-500 font-medium border-b border-neutral-200 dark:border-neutral-700">
                            <tr>
                                <th className="px-6 py-4">Nome / Email</th>
                                <th className="px-6 py-4">Data Registro</th>
                                <th className="px-6 py-4">Função</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                            {loading ? (
                                <tr><td colSpan={5} className="p-8 text-center">Carregando...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                                        Nenhum cliente encontrado.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center text-neutral-600 dark:text-neutral-400 font-bold">
                                                    {user.name?.[0] || <User className="h-5 w-5" />}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-neutral-900 dark:text-white">{user.name || 'Sem nome'}</div>
                                                    <div className="flex items-center gap-1 text-xs text-neutral-500">
                                                        <Mail className="h-3 w-3" />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-neutral-500">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-3 w-3" />
                                                {user.createdAt && format(new Date(user.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.role === 'ADMIN'
                                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                                : 'bg-neutral-50 text-neutral-600 border-neutral-200'
                                                }`}>
                                                {user.role === 'ADMIN' && <Shield className="h-3 w-3" />}
                                                {user.role}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            {user.active ? (
                                                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Ativo
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                                                    <Ban className="w-3 h-3" />
                                                    Inativo
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => openEditModal(user)}>
                                                        <PenBox className="mr-2 h-4 w-4" /> Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteUser(user.id)}>
                                                        <Trash2 className="mr-2 h-4 w-4" /> Excluir
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* EDIT MODAL */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Usuário</DialogTitle>
                        <DialogDescription>
                            Altere permissões e status do usuário.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Função (Role)</Label>
                            <Select value={editRole} onValueChange={setEditRole}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USER">Usuário Comum</SelectItem>
                                    <SelectItem value="ADMIN">Administrador</SelectItem>
                                    <SelectItem value="TECHNICIAN">Técnico</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center justify-between border p-4 rounded-lg">
                            <div className="space-y-0.5">
                                <Label className="text-base">Status da Conta</Label>
                                <div className="text-sm text-neutral-500">
                                    {editActive ? "Conta ativa e com acesso" : "Conta bloqueada/inativa"}
                                </div>
                            </div>
                            <Button
                                variant={editActive ? "destructive" : "default"}
                                onClick={() => setEditActive(!editActive)}
                            >
                                {editActive ? "Desativar" : "Ativar"}
                            </Button>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
                        <Button onClick={handleUpdateUser}>Salvar Alterações</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
