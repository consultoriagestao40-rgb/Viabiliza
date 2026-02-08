import { PrismaClient } from "@prisma/client";
import { User, Bell, Shield, Building, Moon, Sun, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const prisma = new PrismaClient();

async function getUser() {
    // In a real app we'd get the session user ID. For now getting the first admin or user.
    return await prisma.user.findFirst();
}

export default async function SettingsPage() {
    const user = await getUser();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Configurações</h2>
                <p className="text-neutral-500">Gerencie suas preferências e configurações do sistema.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Sidebar Navigation (Visual Only for now) */}
                <div className="md:col-span-1 space-y-1">
                    <button className="w-full flex items-center gap-3 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-medium rounded-lg">
                        <User className="h-4 w-4" /> Meus Dados
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg">
                        <Building className="h-4 w-4" /> Empresa
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg">
                        <Bell className="h-4 w-4" /> Notificações
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg">
                        <Shield className="h-4 w-4" /> Segurança
                    </button>
                </div>

                {/* Main Content */}
                <div className="md:col-span-3 space-y-6">

                    {/* Profile Card */}
                    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-6 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                            Perfil do Usuário
                        </h3>

                        <div className="flex items-center gap-6 mb-8">
                            <div className="h-20 w-20 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center text-3xl font-bold text-neutral-400">
                                {user?.name?.[0] || 'U'}
                            </div>
                            <div>
                                <Button variant="outline" size="sm">Alterar Foto</Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Nome Completo</label>
                                <input
                                    type="text"
                                    defaultValue={user?.name || ''}
                                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Email</label>
                                <input
                                    type="email"
                                    defaultValue={user?.email || ''}
                                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm"
                                    disabled
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Cargo / Função</label>
                                <input
                                    type="text"
                                    defaultValue={user?.role || 'USER'}
                                    disabled
                                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 text-sm"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <Button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700">
                                <Save className="h-4 w-4" /> Salvar Alterações
                            </Button>
                        </div>
                    </div>

                    {/* System Preferences */}
                    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-6 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                            Preferências do Sistema
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border border-neutral-100 dark:border-neutral-800 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Moon className="h-5 w-5 text-neutral-500" />
                                    <div>
                                        <p className="font-medium text-neutral-900 dark:text-white">Modo Escuro</p>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">Ajustar aparência do sistema</p>
                                    </div>
                                </div>
                                <ThemeToggle />
                            </div>

                            <div className="flex items-center justify-between p-4 border border-neutral-100 dark:border-neutral-800 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Bell className="h-5 w-5 text-neutral-500" />
                                    <div>
                                        <p className="font-medium text-neutral-900 dark:text-white">Notificações por Email</p>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">Receber atualizações de chamados</p>
                                    </div>
                                </div>
                                <input type="checkbox" className="h-5 w-5 text-primary-600 rounded" defaultChecked />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
