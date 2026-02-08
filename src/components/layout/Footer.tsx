export function Footer() {
    return (
        <footer className="border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0 text-center md:text-left">
                        <p className="text-sm text-neutral-500">
                            © {new Date().getFullYear()} Viabiliza. Todos os direitos reservados.
                        </p>
                        <p className="text-sm text-neutral-400 mt-1">
                            Contato: (41) 9 9167-2851 | contato@viabilizaincorporadora.com.br
                        </p>
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="text-sm text-neutral-500 hover:text-blue-600">Termos</a>
                        <a href="#" className="text-sm text-neutral-500 hover:text-blue-600">Privacidade</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
