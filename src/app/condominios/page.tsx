
'use client';

import { motion } from 'framer-motion';
import { Check, ArrowRight, Building2, Wrench, ShieldCheck, Clock, Users, Leaf, Droplets, Zap, Paintbrush, Sprout } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function CondominiosPage() {
    return (
        <div className="min-h-screen bg-neutral-50">
            {/* HERO SECTION */}
            <section className="relative overflow-hidden bg-primary-900 text-white pb-20 pt-32 lg:pt-40">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
                                🏢 Facilities PRO: <br />
                                <span className="text-secondary-400">Gestão Proativa</span> de Manutenção
                            </h1>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg md:text-xl text-neutral-300 mb-8 leading-relaxed"
                        >
                            Transforme a manutenção reativa em um sistema proativo e inteligente.
                            Otimize seu orçamento, elimine chamados emergenciais e valorize o patrimônio
                            do seu condomínio com nossos pacotes de serviço mensais.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Link
                                href="#planos"
                                className={cn(
                                    buttonVariants({ size: 'lg' }),
                                    "bg-secondary-500 hover:bg-secondary-600 text-white font-bold h-14 px-8 text-lg rounded-full shadow-lg shadow-secondary-500/20"
                                )}
                            >
                                Ver Planos Mensais
                            </Link>
                            <Link href="https://wa.me/5541991672851?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20o%20Facilities%20PRO" target="_blank">
                                <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10 text-white font-semibold h-14 px-8 text-lg rounded-full backdrop-blur-sm bg-primary-800/60">
                                    Falar com Consultor
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* SUBHEADLINE / BENTO GRID INTRO */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-3xl font-bold text-neutral-900 mb-4">Por que escolher o Facilities PRO?</h2>
                        <p className="text-lg text-neutral-600">
                            Tenha uma equipe de especialistas em hidráulica, elétrica, pintura e jardinagem à sua disposição,
                            com SLA garantido por contrato e gestão centralizada em nossa plataforma digital.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<ShieldCheck className="w-10 h-10 text-secondary-500" />}
                            title="SLA Garantido"
                            description="Prazos de atendimento definidos em contrato. Chega de esperar dias por um reparo simples."
                        />
                        <FeatureCard
                            icon={<Users className="w-10 h-10 text-secondary-500" />}
                            title="Equipe Centralizada"
                            description="Fim da gestão de múltiplos fornecedores. Uma única equipe qualificada e uniformizada para tudo."
                        />
                        <FeatureCard
                            icon={<Building2 className="w-10 h-10 text-secondary-500" />}
                            title="Valorização Patrimonial"
                            description="A manutenção preventiva constante mantém as áreas comuns impecáveis e valoriza o imóvel."
                        />
                    </div>
                </div>
            </section>

            {/* COMO FUNCIONA */}
            <section className="py-20 bg-neutral-50 border-t border-neutral-100">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-primary-900 flex items-center justify-center gap-3">
                            <Zap className="text-secondary-500" />
                            Como Funciona o Ecossistema
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                        <Step
                            number="1"
                            title="Contrate o Plano Ideal"
                            description="Escolha o pacote de horas que melhor se adapta à demanda e tamanho do seu condomínio."
                        />
                        <Step
                            number="2"
                            title="Acione Sob Demanda"
                            description="Abra chamados diretamente pela nossa plataforma online ou via WhatsApp. Simples, rápido e rastreável."
                        />
                        <Step
                            number="3"
                            title="Resolução com SLA"
                            description="Nossa equipe técnica é acionada e cumpre o serviço dentro do prazo contratual."
                        />
                    </div>
                </div>
            </section>

            {/* PLANOS (PRICING) */}
            <section id="planos" className="py-24 bg-primary-900 text-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Nossos Planos de Assinatura</h2>
                        <p className="text-neutral-300 max-w-2xl mx-auto">
                            Soluções escaláveis para condomínios de todos os portes. Previsibilidade orçamentária para sua gestão.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {/* PRO 10 */}
                        <PricingCard
                            name="PRO 10"
                            hours="10"
                            idealFor="Pequeno porte (até 40 un) ou baixa demanda."
                            sla="Até 24h úteis"
                            benefit="Custo-benefício para o essencial."
                        />

                        {/* PRO 20 - Highlighted */}
                        <PricingCard
                            name="PRO 20"
                            hours="20"
                            idealFor="Médio porte (40-100 un), reparos regulares."
                            sla="Até 12h úteis"
                            benefit="Equilíbrio ideal: investimento x cobertura."
                            featured={true}
                        />

                        {/* PRO 40 */}
                        <PricingCard
                            name="PRO 40"
                            hours="40"
                            idealFor="Grande porte (+100 un) ou alta demanda."
                            sla="Até 4h úteis (Prioritário)"
                            benefit="Máxima agilidade para gestão complexa."
                        />

                        {/* ENTERPRISE */}
                        <div className="bg-neutral-800 rounded-2xl p-8 border border-neutral-700 flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Building2 className="w-24 h-24" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                            <div className="text-3xl font-bold text-secondary-400 mb-4">Customizado</div>
                            <p className="text-sm text-neutral-400 mb-6 flex-grow">
                                Grandes complexos, comerciais ou redes que exigem gerente dedicado.
                            </p>
                            <ul className="space-y-4 mb-8 text-sm text-neutral-300">
                                <li className="flex items-start gap-2"><Check className="w-5 h-5 text-secondary-500 shrink-0" /> Gestão dedicada</li>
                                <li className="flex items-start gap-2"><Check className="w-5 h-5 text-secondary-500 shrink-0" /> Relatórios gerenciais</li>
                                <li className="flex items-start gap-2"><Check className="w-5 h-5 text-secondary-500 shrink-0" /> SLA Personalizado</li>
                            </ul>
                            <Link href="/chamados/novo" className="w-full">
                                <Button className="w-full bg-white text-primary-900 hover:bg-neutral-200 font-bold">
                                    Cotar Enterprise
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* VANTAGENS DO SINDICO */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-neutral-900 mb-8">
                                ✅ Vantagens Estratégicas para o Síndico
                            </h2>
                            <div className="space-y-6">
                                <AdvantageItem
                                    title="Previsibilidade Orçamentária"
                                    description="Custo fixo mensal. Acabe com as surpresas de gastos emergenciais. Horas não utilizadas são faturadas para garantir disponibilidade."
                                />
                                <AdvantageItem
                                    title="Gestão Centralizada e Transparente"
                                    description="Acompanhe todos os chamados, consumo de horas e histórico diretamente no dashboard online."
                                />
                                <AdvantageItem
                                    title="Equipe Qualificada"
                                    description="Profissionais uniformizados, checados e seguindo protocolos rígidos de segurança."
                                />
                                <AdvantageItem
                                    title="Valorização do Patrimônio"
                                    description="Manutenção preventiva que evita degradação e melhora a qualidade de vida dos moradores."
                                />
                            </div>
                        </div>

                        {/* Visual element / Image placeholder */}
                        <div className="bg-neutral-100 rounded-3xl p-8 aspect-square flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-900/5 to-secondary-500/10"></div>
                            <div className="text-center relative z-10">
                                <ShieldCheck className="w-32 h-32 text-primary-900 mx-auto mb-6 opacity-80" />
                                <p className="text-xl font-medium text-neutral-600">Tranquilidade garantida<br />para sua gestão</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ESCOPO DE SERVIÇOS */}
            <section className="py-24 bg-neutral-900 text-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
                            <Wrench className="text-secondary-500" />
                            Escopo de Serviços Incluídos
                        </h2>
                        <p className="text-neutral-400">Cobertura completa para as necessidades do dia a dia.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <ServiceScopeCard
                            icon={<Droplets className="w-8 h-8 text-blue-400" />}
                            title="Hidráulica"
                            items={[
                                "Reparo de vazamentos (torneiras, sifões)",
                                "Desentupimentos simples (pias, ralos)",
                                "Ajuste de boias e caixas d'água",
                                "Troca de reparos de descarga"
                            ]}
                        />
                        <ServiceScopeCard
                            icon={<Zap className="w-8 h-8 text-yellow-400" />}
                            title="Elétrica (Baixa Tensão)"
                            items={[
                                "Troca de lâmpadas e reatores",
                                "Reparo em interruptores/tomadas",
                                "Reaperto de conexões em quadros",
                                "Instalação de sensores de presença"
                            ]}
                        />
                        <ServiceScopeCard
                            icon={<Paintbrush className="w-8 h-8 text-pink-400" />}
                            title="Pintura e Reparos"
                            items={[
                                "Retoques em áreas comuns",
                                "Pequenas fissuras e descascados",
                                "Lubrificação de portas/dobradiças",
                                "Fixação de itens diversos"
                            ]}
                        />
                        <ServiceScopeCard
                            icon={<Leaf className="w-8 h-8 text-green-400" />}
                            title="Jardinagem"
                            items={[
                                "Poda de gramados e plantas menores",
                                "Limpeza e adubação de canteiros",
                                "Controle de ervas daninhas",
                                "Manutenção de irrigação simples"
                            ]}
                        />
                    </div>

                    <div className="mt-20 text-center">
                        <h3 className="text-2xl font-bold mb-8">Pronto para modernizar seu condomínio?</h3>
                        <Link href="/chamados/novo">
                            <Button size="lg" className="bg-secondary-500 hover:bg-secondary-600 text-white font-bold h-14 px-10 rounded-full text-lg shadow-xl shadow-secondary-500/20 transform hover:scale-105 transition-all">
                                Contratar Facilities PRO
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

// --- SUBCOMPONENTS ---

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-8 rounded-2xl bg-neutral-50 border border-neutral-100 hover:shadow-lg transition-shadow text-center">
            <div className="flex justify-center mb-6">{icon}</div>
            <h3 className="text-xl font-bold text-neutral-900 mb-3">{title}</h3>
            <p className="text-neutral-600 leading-relaxed">{description}</p>
        </div>
    )
}

function Step({ number, title, description }: { number: string, title: string, description: string }) {
    return (
        <div className="relative pl-12 md:pl-0 md:text-center group">
            <div className="absolute left-0 top-0 md:relative md:mx-auto w-12 h-12 rounded-full bg-primary-900 text-white flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-primary-900/20">
                {number}
            </div>
            <h3 className="text-xl font-bold text-primary-900 mb-2">{title}</h3>
            <p className="text-neutral-600">{description}</p>
        </div>
    )
}

function PricingCard({ name, hours, idealFor, sla, benefit, featured = false }: { name: string, hours: string, idealFor: string, sla: string, benefit: string, featured?: boolean }) {
    return (
        <div className={cn(
            "rounded-2xl p-8 flex flex-col relative overflow-hidden transition-transform hover:-translate-y-1",
            featured
                ? "bg-gradient-to-b from-secondary-500 to-secondary-600 text-white shadow-2xl shadow-secondary-500/30 scale-105 z-10 ring-4 ring-white/20"
                : "bg-white text-neutral-900 border border-neutral-200"
        )}>
            {featured && (
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                    MAIS POPULAR
                </div>
            )}

            <h3 className={cn("text-2xl font-bold mb-2", featured ? "text-white" : "text-primary-900")}>{name}</h3>
            <div className="flex items-baseline gap-1 mb-6">
                <span className={cn("text-4xl font-extrabold", featured ? "text-white" : "text-primary-900")}>{hours}h</span>
                <span className={cn("text-sm", featured ? "text-white/80" : "text-neutral-500")}>/ mês</span>
            </div>

            <div className="space-y-4 mb-8 flex-grow">
                <div className="text-sm">
                    <span className={cn("block font-bold mb-1", featured ? "text-white/90" : "text-neutral-900")}>Ideal para:</span>
                    <p className={cn(featured ? "text-white/80" : "text-neutral-600")}>{idealFor}</p>
                </div>
                <div className="text-sm">
                    <span className={cn("block font-bold mb-1", featured ? "text-white/90" : "text-neutral-900")}>SLA:</span>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 opacity-70" />
                        <p className={cn(featured ? "text-white/80" : "text-neutral-600")}>{sla}</p>
                    </div>
                </div>
                <div className="text-sm border-t pt-4 border-current opacity-80">
                    <span className="font-bold mr-1">Benefício:</span>
                    {benefit}
                </div>
            </div>

            <Link href="/chamados/novo" className="w-full">
                <Button className={cn(
                    "w-full font-bold",
                    featured
                        ? "bg-white text-secondary-600 hover:bg-neutral-100"
                        : "bg-primary-900 text-white hover:bg-primary-800"
                )}>
                    Contratar Agora
                </Button>
            </Link>
        </div>
    )
}

function AdvantageItem({ title, description }: { title: string, description: string }) {
    return (
        <div className="flex gap-4">
            <div className="mt-1">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                </div>
            </div>
            <div>
                <h3 className="font-bold text-neutral-900 mb-1">{title}</h3>
                <p className="text-sm text-neutral-600">{description}</p>
            </div>
        </div>
    )
}

function ServiceScopeCard({ icon, title, items }: { icon: React.ReactNode, title: string, items: string[] }) {
    return (
        <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 hover:border-neutral-600 transition-colors">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-neutral-900/50 border border-neutral-700">
                    {icon}
                </div>
                <h3 className="font-bold text-lg text-white">{title}</h3>
            </div>
            <ul className="space-y-3">
                {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 mt-1.5 shrink-0"></span>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    )
}
