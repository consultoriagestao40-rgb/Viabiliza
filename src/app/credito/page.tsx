
'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
    Building,
    Wallet,
    Clock,
    CheckCircle,
    ArrowRight,
    Users,
    Briefcase,
    HardHat
} from 'lucide-react';

export default function ViabilizaCreditoPage() {
    const WHATSAPP_LINK = "https://wa.me/5541991672851?text=Ol%C3%A1%2C%20gostaria%20de%20conhecer%20mais%20sobre%20a%20Viabiliza";
    const SIMULATION_LINK = "https://cliente.mcf.house/nova-os/14657/30";

    return (
        <div className="min-h-screen bg-white">
            {/* HERO SECTION */}
            <section className="relative overflow-hidden bg-neutral-900 text-white pt-32 pb-20 lg:pt-48 lg:pb-32">
                {/* Abstract Background */}
                <div className="absolute inset-0 overflow-hidden opacity-20">
                    <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-secondary-600 blur-[100px]"></div>
                    <div className="absolute bottom-[0%] left-[0%] w-[500px] h-[500px] rounded-full bg-primary-800 blur-[120px]"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight mb-8 leading-tight">
                            Crédito Imobiliário Aprovado <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-400 to-secondary-200">
                                em 5 a 10 Dias
                            </span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-2xl text-neutral-300 max-w-3xl mx-auto mb-10 leading-relaxed font-light"
                    >
                        Mesmo sem renda formal. O banco disse "não"? Nós viabilizamos seu crédito de forma 100% online e sem burocracia.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <Link href={SIMULATION_LINK} target="_blank">
                            <Button size="lg" className="bg-secondary-500 hover:bg-secondary-600 text-white font-bold h-16 px-10 text-lg rounded-full shadow-lg shadow-secondary-500/20 w-full sm:w-auto transform transition-transform hover:scale-105">
                                💰 SIMULAR CRÉDITO AGORA
                            </Button>
                        </Link>
                        <Link href={WHATSAPP_LINK} target="_blank">
                            <Button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-neutral-900 font-bold h-16 px-10 text-lg rounded-full w-full sm:w-auto transition-colors">
                                Fale com um Especialista
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* CREDIT MODALITIES SECTION (NEW) */}
            <section className="py-24 bg-white relative z-10 -mt-10 rounded-t-[3rem]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-secondary-500 font-bold tracking-wider uppercase text-sm">Nossas Soluções</span>
                        <h2 className="text-3xl lg:text-5xl font-black text-primary-900 mt-2">Escolha sua Modalidade</h2>
                        <p className="text-neutral-500 max-w-2xl mx-auto mt-4 text-lg">
                            Possuímos diversas modalidades de crédito. Escolha a que mais se encaixa na sua necessidade de moradia ou investimento.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <CreditCard
                            code="AC"
                            title="Aquisição e Construção"
                            desc="Financie a compra do terreno e a construção da sua casa em um único processo. Economize até 40% comparado a comprar pronto."
                        />
                        <CreditCard
                            code="CT"
                            title="Construção em Terreno Próprio"
                            desc="Já tem o terreno? Financie 100% da obra da sua casa. Transforme seu lote no lar dos seus sonhos."
                        />
                        <CreditCard
                            code="RA"
                            title="Reforma e Ampliação"
                            desc="Quer reformar mas está sem capital? Tire o sonho do papel e valorize seu imóvel com parcelas que cabem no bolso."
                        />
                        <CreditCard
                            code="CGI"
                            title="Crédito com Garantia"
                            desc="Use seu imóvel quitado como garantia para conseguir juros mais baixos e crédito de livre destinação (Home Equity)."
                        />
                        <CreditCard
                            code="IN"
                            title="Imóvel Novo"
                            desc="Financiamento tradicional para comprar seu imóvel novo, pronto para morar, com as melhores taxas do mercado."
                        />
                        <CreditCard
                            code="IU"
                            title="Imóvel Usado"
                            desc="Gostou de uma oportunidade usada? Nós viabilizamos o financiamento para você fechar negócio rápido."
                        />
                        <CreditCard
                            code="CC"
                            title="Crédito para Condomínio"
                            desc="Síndico, tire as melhorias do papel. Linha exclusiva para obras e reformas em condomínios sem onerar o caixa."
                        />
                    </div>
                </div>
            </section>

            {/* PARA QUEM É */}
            <section className="py-24 bg-neutral-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">Para Quem é a Viabiliza?</h2>
                        <p className="text-neutral-600 max-w-2xl mx-auto text-lg">
                            Soluções personalizadas para diferentes perfis e necessidades.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <ProfileCard
                            icon={<Building className="w-12 h-12 text-secondary-500" />}
                            title="Sonho da Casa Própria"
                            description="O banco negou por falta de renda formal? Nós estruturamos a solução ideal para você construir a casa dos sonhos."
                            features={[
                                "Linhas que bancos tradicionais não oferecem",
                                "Processo digital e transparente",
                                "Receba a chave de uma casa pronta"
                            ]}
                            ctaLink={SIMULATION_LINK}
                            ctaText="Verificar meu Acesso"
                        />

                        {/* Card 2 */}
                        <ProfileCard
                            icon={<HardHat className="w-12 h-12 text-secondary-500" />}
                            title="Construtores"
                            description="Seus clientes querem construir mas o banco nega? Não perca vendas. Nós viabilizamos o crédito e você executa a obra."
                            features={[
                                "Acesse clientes antes 'inviáveis'",
                                "Aprovação em 5-10 dias",
                                "Aumente seu volume de obras"
                            ]}
                            ctaLink={WHATSAPP_LINK}
                            ctaText="Parceria para Construtores"
                        />

                        {/* Card 3 */}
                        <ProfileCard
                            icon={<Briefcase className="w-12 h-12 text-secondary-500" />}
                            title="Investidores"
                            description="Oportunidade de desenvolvimento imobiliário com gestão completa. Você entra com a renda, nós estruturamos tudo."
                            features={[
                                "Oportunidades selecionadas",
                                "Gestão do projeto à entrega",
                                "Rentabilidade com segurança"
                            ]}
                            ctaLink={WHATSAPP_LINK}
                            ctaText="Proposta de Investimento"
                        />
                    </div>
                </div>
            </section>

            {/* PROCESSO */}
            <section className="py-24 border-t border-neutral-100">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-primary-900 mb-6">Processo Ágil em 4 Etapas</h2>
                        <div className="h-1 w-24 bg-secondary-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="space-y-12 relative before:absolute before:inset-y-0 before:left-[28px] md:before:left-1/2 before:-translate-x-1/2 before:w-1 before:bg-neutral-200">
                        <ProcessStep
                            number="1"
                            title="Análise Inicial (Dia 1-2)"
                            text="Você preenche um formulário rápido e fazemos uma análise de viabilidade 100% digital."
                            align="right"
                        />
                        <ProcessStep
                            number="2"
                            title="Estruturação (Dia 3-5)"
                            text="Estruturamos a melhor linha de crédito para seu perfil com nossas parcerias exclusivas."
                            align="left"
                        />
                        <ProcessStep
                            number="3"
                            title="Aprovação (Dia 6-10)"
                            text="Crédito aprovado! Você recebe a confirmação e os detalhes para seguir em frente."
                            align="right"
                        />
                        <ProcessStep
                            number="4"
                            title="Liberação e Construção"
                            text="Com crédito liberado, cuidamos de tudo, do projeto até a entrega das chaves."
                            align="left"
                            isLast
                        />
                    </div>

                    <div className="mt-20 text-center">
                        <Link href={WHATSAPP_LINK} target="_blank">
                            <Button className="bg-green-600 hover:bg-green-700 text-white font-bold h-14 px-8 rounded-full text-lg shadow-xl shadow-green-600/20">
                                Iniciar Processo no WhatsApp
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

function CreditCard({ code, title, desc }: any) {
    const SIMULATION_LINK = "https://cliente.mcf.house/nova-os/14657/30";

    return (
        <div className="group bg-white rounded-3xl p-8 border border-neutral-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-full -mr-10 -mt-10 opacity-50 group-hover:scale-110 transition-transform"></div>

            <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary-900 text-white flex items-center justify-center font-black text-xl mb-6 shadow-md group-hover:bg-secondary-500 transition-colors">
                    {code}
                </div>

                <h3 className="text-xl font-bold text-primary-900 mb-3 min-h-[3.5rem] flex items-center">
                    {title}
                </h3>

                <p className="text-neutral-500 text-sm leading-relaxed mb-6 min-h-[4rem]">
                    {desc}
                </p>

                <Link href={SIMULATION_LINK} target="_blank">
                    <Button className="w-full bg-neutral-100 text-primary-900 hover:bg-primary-900 hover:text-white font-bold transition-all">
                        Selecionar Modalidade
                    </Button>
                </Link>
            </div>
        </div>
    )
}

function ProfileCard({ icon, title, description, features, ctaLink, ctaText }: any) {
    return (
        <div className="bg-white p-8 rounded-2xl border border-neutral-200 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col">
            <div className="mb-6 bg-neutral-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-center mb-4 text-neutral-900">{title}</h3>
            <p className="text-neutral-600 text-center mb-8 text-sm leading-relaxed">
                {description}
            </p>
            <ul className="space-y-3 mb-8 flex-grow">
                {features.map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-neutral-500">
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                        {f}
                    </li>
                ))}
            </ul>
            <Link href={ctaLink} target="_blank">
                <Button variant="outline" className="w-full border-secondary-500 text-secondary-600 hover:bg-secondary-50 font-bold">
                    {ctaText}
                </Button>
            </Link>
        </div>
    )
}

function ProcessStep({ number, title, text, align, isLast }: any) {
    const isRight = align === 'right';
    return (
        <div className={`relative flex items-center justify-between md:justify-normal ${isRight ? 'md:flex-row-reverse' : ''}`}>

            {/* Dot on Timeline */}
            <div className="absolute left-[8px] md:left-1/2 md:-translate-x-1/2 w-10 h-10 rounded-full bg-primary-900 border-4 border-white shadow-lg flex items-center justify-center text-white font-bold z-10">
                {number}
            </div>

            {/* Content Box */}
            <div className={`w-[calc(100%-60px)] ml-[60px] md:ml-0 md:w-[45%] bg-white p-6 rounded-2xl shadow-sm border border-neutral-100`}>
                <h4 className="text-lg font-bold text-primary-900 mb-2">{title}</h4>
                <p className="text-neutral-600 text-sm">{text}</p>
            </div>

            {/* Empty space for the other side on desktop */}
            <div className="hidden md:block md:w-[45%]"></div>
        </div>
    )
}
