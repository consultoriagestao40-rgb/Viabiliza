'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Soluções', href: '/#services' },
        { name: 'Para Condomínios', href: '/condominios' },
        { name: 'Viabiliza Crédito', href: '/credito' },
        { name: 'Como Funciona', href: '/#process' },
    ];

    return (
        <header
            className={cn(
                'fixed top-0 z-50 w-full transition-all duration-300 border-b',
                isScrolled
                    ? 'bg-white shadow-sm border-neutral-200 py-3'
                    : 'bg-white shadow-sm border-transparent py-5'
            )}
        >
            <div className="container mx-auto flex items-center justify-between px-6 lg:px-8">
                {/* LOGO */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="h-10 w-10 flex items-center justify-center bg-primary-900 rounded-lg text-white">
                        {/* Tech Icon Placeholder */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-extrabold tracking-tight text-primary-900 leading-none">VIABILIZA</span>
                        <span className="text-[0.65rem] font-bold text-secondary-600 tracking-widest uppercase">REFORMAS E REPAROS</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-semibold text-neutral-600 hover:text-primary-900 transition-colors uppercase tracking-wide"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* CTAs */}
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/login" className="text-sm font-bold text-neutral-700 hover:text-primary-900">
                        LOGIN
                    </Link>
                    <Link href="/chamados/novo">
                        <Button className="bg-secondary-500 hover:bg-secondary-600 text-white font-bold rounded-lg shadow-lg shadow-secondary-500/20 transition-transform active:scale-95">
                            ABRIR CHAMADO⚡
                        </Button>
                    </Link>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <Menu className="h-7 w-7" aria-hidden="true" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 shadow-2xl"
                    >
                        <div className="flex items-center justify-between">
                            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
                                <div className="h-8 w-8 flex items-center justify-center bg-primary-900 rounded text-white">
                                    <span className="font-bold">V</span>
                                </div>
                                <span className="text-lg font-bold text-primary-900">VIABILIZA</span>
                            </Link>
                            <button
                                type="button"
                                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span className="sr-only">Close menu</span>
                                <X className="h-6 w-6" aria-hidden="true" />
                            </button>
                        </div>
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-gray-500/10">
                                <div className="space-y-2 py-6">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                                <div className="py-6 space-y-3">
                                    <Link
                                        href="/login"
                                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Área do Cliente
                                    </Link>
                                    <Link href="/chamados/novo" onClick={() => setMobileMenuOpen(false)}>
                                        <Button className="w-full bg-secondary-500 hover:bg-secondary-600 text-white font-bold">
                                            ABRIR CHAMADO AGORA
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
