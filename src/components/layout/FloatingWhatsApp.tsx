'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

export function FloatingWhatsApp() {
    return (
        <Link
            href="https://wa.me/5541991672851"
            target="_blank"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white px-4 py-2 rounded-full shadow-lg border border-neutral-100 hidden group-hover:flex flex-col items-start"
            >
                <span className="text-xs font-bold text-neutral-900">Precisa de ajuda?</span>
                <span className="text-[10px] text-neutral-500">Respondemos em 2 min</span>
            </motion.div>

            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="h-14 w-14 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-xl shadow-green-500/30"
            >
                <MessageCircle className="h-8 w-8 fill-current" />
                <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            </motion.div>
        </Link>
    );
}
