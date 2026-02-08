'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-neutral-50 pt-24 lg:pt-32 pb-16 lg:pb-0">

            {/* Background Decor */}
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-secondary-200 to-primary-200 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
            </div>

            <div className="container mx-auto px-6 lg:px-8">
                <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-x-16 lg:h-[85vh] lg:items-center">

                    {/* Text Content */}
                    <div className="lg:col-span-6 text-center lg:text-left pt-10 lg:pt-0">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-700 ring-1 ring-inset ring-primary-700/10 mb-6">
                                <span className="flex h-2 w-2 rounded-full bg-secondary-500 animate-pulse"></span>
                                Tecnologia em Manutenção Predial
                            </div>

                            <h1 className="text-4xl font-extrabold tracking-tight text-primary-950 sm:text-5xl lg:text-6xl mb-6 leading-tight">
                                A Gestão de Manutenção Predial que <span className="text-primary-700">Curitiba Confia.</span>
                            </h1>

                            <p className="mt-4 text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                Reformas, reparos e manutenção com <strong>SLA Garantido</strong>. Controle total na palma da sua mão, do orçamento ao pagamento.
                            </p>

                            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <Link href="/chamados/novo" className="w-full sm:w-auto">
                                    <Button size="lg" className="h-14 w-full sm:w-auto px-8 text-base bg-secondary-500 hover:bg-secondary-600 text-white shadow-xl shadow-secondary-500/20 rounded-xl font-bold transition-all hover:-translate-y-1">
                                        Abrir Chamado Agora
                                        <Zap className="ml-2 h-5 w-5 fill-current" />
                                    </Button>
                                </Link>
                                <Link href="/orcamento" className="w-full sm:w-auto">
                                    <Button variant="outline" size="lg" className="h-14 w-full sm:w-auto px-8 text-base border-neutral-300 hover:bg-neutral-50 text-neutral-700 rounded-xl font-semibold">
                                        Solicitar Orçamento
                                    </Button>
                                </Link>
                            </div>

                            <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 text-sm font-medium text-neutral-500">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-primary-600" />
                                    <span>Profissionais Verificados</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-primary-600" />
                                    <span>Atendimento em 24h</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Visual/Image Side */}
                    <div className="lg:col-span-6 mt-16 lg:mt-0 relative">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            {/* Main Hero Image */}
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 bg-neutral-900 aspect-[4/3] lg:aspect-auto lg:h-[600px]">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                                <img
                                    src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop"
                                    alt="Profissional de Facilities Viabiliza"
                                    className="h-full w-full object-cover object-center opacity-90"
                                />

                                {/* Floating App Mockup Card */}
                                <div className="absolute bottom-6 left-6 right-6 z-20">
                                    <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/20">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                                <CheckCircle2 className="h-6 w-6" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-semibold text-neutral-500 uppercase">Status em Tempo Real</p>
                                                <p className="font-bold text-neutral-900">Técnico Enivaldo a caminho</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-bold text-neutral-400">ETA</span>
                                                <p className="font-bold text-primary-600">15 min</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute -z-10 -bottom-10 -right-10 h-64 w-64 bg-secondary-500 rounded-full blur-[100px] opacity-20" />
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
