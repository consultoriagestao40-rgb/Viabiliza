'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const phone = formData.get('phone') as string;

        // Simple validation
        if (!phone) {
            setError('WhatsApp é obrigatório');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, phone }),
            });

            if (res.ok) {
                router.push('/login?registered=true');
            } else {
                const data = await res.json();
                setError(data.message || 'Erro ao criar conta.');
            }
        } catch (err) {
            setError('Ocorreu um erro inesperado.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-900 relative overflow-hidden">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-10 right-10 w-72 h-72 bg-primary-400/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary-400/20 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md space-y-8 relative z-10 bg-white dark:bg-neutral-950 p-8 rounded-2xl shadow-xl ring-1 ring-neutral-200 dark:ring-neutral-800"
            >
                <div className="text-center">
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        Crie sua conta
                    </h2>
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                        Junte-se a nós e transforme seu ambiente. <br />
                        Já tem uma conta?{' '}
                        <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                            Fazer login
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Nome Completo</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                placeholder="Seu nome"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="email-address">Email</Label>
                            <Input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                placeholder="voce@exemplo.com"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="phone">WhatsApp / Telefone</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                autoComplete="tel"
                                required
                                placeholder="(11) 99999-9999"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                placeholder="••••••••"
                                className="mt-1"
                            />
                            <p className="text-xs text-neutral-500 mt-1">Mínimo de 6 caracteres</p>
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 text-sm"
                        >
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </motion.div>
                    )}

                    <div>
                        <Button
                            type="submit"
                            className="w-full rounded-lg shadow-lg shadow-primary-500/20"
                            disabled={loading}
                            size="lg"
                        >
                            {loading ? 'Criando conta...' : 'Registrar-se'}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
