'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function RecoveryPage() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSubmitted(true);
        setLoading(false);
    }

    return (
        <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-900 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-10 right-10 w-72 h-72 bg-primary-400/20 rounded-full blur-[100px] animate-pulse" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md space-y-8 relative z-10 bg-white dark:bg-neutral-950 p-8 rounded-2xl shadow-xl ring-1 ring-neutral-200 dark:ring-neutral-800"
            >
                <div className="text-center">
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        Recuperar Senha
                    </h2>
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                        Digite seu email para receber as instruções.
                    </p>
                </div>

                {submitted ? (
                    <div className="text-center space-y-4 py-4">
                        <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-medium text-neutral-900">Verifique seu email</h3>
                        <p className="text-sm text-neutral-500">
                            Se houver uma conta associada a este email, enviaremos um link de recuperação em instantes.
                        </p>
                        <Link href="/login">
                            <Button variant="outline" className="mt-4 w-full">Voltar para Login</Button>
                        </Link>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                placeholder="seu@email.com"
                                className="mt-1"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                        </Button>

                        <div className="text-center">
                            <Link href="/login" className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Login
                            </Link>
                        </div>
                    </form>
                )}
            </motion.div>
        </div>
    );
}
