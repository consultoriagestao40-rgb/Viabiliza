'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { CheckCircle2, ChevronRight, ChevronLeft, Upload, MapPin, AlertCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const STEPS = [
    { id: 'service', title: 'Serviço' },
    { id: 'details', title: 'Detalhes' },
    { id: 'location', title: 'Localização' },
    { id: 'schedule', title: 'Agendamento' },
    { id: 'review', title: 'Confirmação' },
];

const SERVICE_TYPES = [
    'Elétrica', 'Hidráulica', 'Pintura', 'Alvenaria', 'Montagem', 'Climatização', 'Limpeza', 'Projetos'
];

export default function NewTicketPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        serviceType: '',
        description: '',
        urgency: 'Normal',
        location: '',
        scheduledDate: '',
        photos: [] as string[]
    });

    const handleNext = () => { if (currentStep < STEPS.length - 1) setCurrentStep(c => c + 1); };
    const handleBack = () => { if (currentStep > 0) setCurrentStep(c => c - 1); };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) router.push('/dashboard?ticketCreated=true');
            else alert('Erro ao criar chamado.');
        } catch (error) {
            alert('Erro de conexão.');
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field: string, value: any) => setFormData(p => ({ ...p, [field]: value }));

    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4 bg-neutral-50 dark:bg-neutral-900">
                <div className="p-8 bg-white dark:bg-neutral-950 rounded-2xl shadow-xl text-center max-w-md">
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Faça login para continuar</h2>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-2 mb-6">Você precisa estar autenticado para solicitar serviços.</p>
                    <Link href="/login?callbackUrl=/chamados/novo">
                        <Button size="lg" className="w-full">Fazer Login</Button>
                    </Link>
                </div>
            </div>
        )
    }

    // Import Link locally to avoid top-level missing import error if not imported

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Novo Chamado</h1>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-2">Descreva sua necessidade e encontre o profissional ideal.</p>
                </div>

                {/* Improved Progress Bar */}
                <div className="mb-12 relative">
                    <div className="absolute left-0 top-1/2 -z-10 h-1 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full" />
                    <div
                        className="absolute left-0 top-1/2 -z-10 h-1 bg-primary-500 rounded-full transition-all duration-500"
                        style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                    />

                    <div className="flex justify-between w-full">
                        {STEPS.map((step, index) => (
                            <div key={step.id} className="flex flex-col items-center gap-2">
                                <motion.div
                                    initial={false}
                                    animate={{
                                        backgroundColor: index <= currentStep ? 'var(--primary-600)' : 'var(--neutral-200)',
                                        scale: index === currentStep ? 1.2 : 1
                                    }}
                                    className={cn(
                                        "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white transition-colors duration-300 shadow-md",
                                        index > currentStep && "bg-neutral-200 text-neutral-500 dark:bg-neutral-800"
                                    )}
                                >
                                    {index + 1}
                                </motion.div>
                                <span className={cn(
                                    "text-[10px] uppercase font-bold tracking-wider transition-colors duration-300 hidden sm:block",
                                    index <= currentStep ? "text-primary-600" : "text-neutral-400"
                                )}>
                                    {step.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Wizard Card */}
                <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-xl border border-neutral-100 dark:border-neutral-800 overflow-hidden">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="p-6 sm:p-10 min-h-[400px]"
                        >
                            {/* Step 1: Service */}
                            {currentStep === 0 && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">Qual tipo de serviço?</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {SERVICE_TYPES.map(type => (
                                            <button
                                                key={type}
                                                onClick={() => updateField('serviceType', type)}
                                                className={cn(
                                                    "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 active:scale-95",
                                                    formData.serviceType === type
                                                        ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300"
                                                        : "border-transparent bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
                                                )}
                                            >
                                                <span className="font-semibold">{type}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Details */}
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <div>
                                        <Label className="text-base">Descrição Detalhada</Label>
                                        <textarea
                                            className="mt-2 w-full rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:bg-neutral-900 dark:border-neutral-800 min-h-[150px]"
                                            placeholder="Descreva o problema, o que precisa ser feito, etc..."
                                            value={formData.description}
                                            onChange={(e) => updateField('description', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-base mb-3 block">Nível de Urgência</Label>
                                        <div className="flex flex-wrap gap-3">
                                            {['Baixa', 'Normal', 'Alta', 'Emergência'].map(level => (
                                                <button
                                                    key={level}
                                                    onClick={() => updateField('urgency', level)}
                                                    className={cn(
                                                        "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                                                        formData.urgency === level
                                                            ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900"
                                                            : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 dark:bg-neutral-900 dark:text-neutral-400 dark:border-neutral-700"
                                                    )}
                                                >
                                                    {level}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Location */}
                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <div>
                                        <Label className="text-base">Endereço Completo</Label>
                                        <div className="relative mt-2">
                                            <MapPin className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                                            <Input
                                                className="pl-10 h-12 text-lg"
                                                placeholder="Rua, Número, Bairro..."
                                                value={formData.location}
                                                onChange={(e) => updateField('location', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Schedule */}
                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <div>
                                        <Label className="text-base">Melhor dia e horário</Label>
                                        <div className="relative mt-2">
                                            <Calendar className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                                            <Input
                                                type="datetime-local"
                                                className="pl-10 h-12 text-lg"
                                                value={formData.scheduledDate}
                                                onChange={(e) => updateField('scheduledDate', e.target.value)}
                                            />
                                        </div>
                                        <p className="mt-4 text-sm text-neutral-500 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-lg flex gap-2">
                                            <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                            A data é uma sugestão. O profissional confirmará a disponibilidade.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Step 5: Review */}
                            {currentStep === 4 && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold text-center">Tudo certo?</h3>
                                    <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6 space-y-4 border border-neutral-100 dark:border-neutral-800">
                                        <ReviewItem label="Serviço" value={formData.serviceType} />
                                        <ReviewItem label="Urgência" value={formData.urgency} />
                                        <ReviewItem label="Data Sugerida" value={formData.scheduledDate ? new Date(formData.scheduledDate).toLocaleString() : 'Não informada'} />
                                        <ReviewItem label="Endereço" value={formData.location} />
                                        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                                            <span className="text-xs text-neutral-400 uppercase font-bold tracking-wider">Descrição</span>
                                            <p className="mt-1 text-neutral-700 dark:text-neutral-300">{formData.description}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Footer controls */}
                    <div className="bg-neutral-50 dark:bg-neutral-900/50 p-6 border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                        <Button
                            variant="ghost"
                            onClick={handleBack}
                            disabled={currentStep === 0}
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
                        </Button>

                        {currentStep < STEPS.length - 1 ? (
                            <Button onClick={handleNext} disabled={
                                (currentStep === 0 && !formData.serviceType) ||
                                (currentStep === 1 && !formData.description) ||
                                (currentStep === 2 && !formData.location)
                            }>
                                Próximo <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white px-8">
                                {loading ? 'Enviando...' : 'Confirmar Solicitação'} <CheckCircle2 className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

function ReviewItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-500">{label}</span>
            <span className="font-medium text-neutral-900 dark:text-white">{value}</span>
        </div>
    )
}
