'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, ArrowLeft, Loader2, DollarSign, MapPin, Car, Info } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MileageSettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [settings, setSettings] = useState({
        origin_address: "Rua Rio Pequiri, 699, Pinhais - PR, Brasil",
        vehicle_fuel_consumption: "10",
        maintenance_tires_cost_km: "0.20",
        vehicle_value_current: "45000",
        vehicle_value_residual: "30000",
        vehicle_km_lifecycle: "150000",
        gas_price_fallback: "5.89",
        displacement_multiplier: "2"
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    // Merge with defaults
                    setSettings(prev => ({ ...prev, ...data }));
                }
            } catch (error) {
                console.error("Failed to load settings");
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (key: string, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            if (res.ok) {
                alert('Configurações salvas!');
            } else {
                alert('Erro ao salvar.');
            }
        } catch (error) {
            alert('Erro de conexão.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary-500" /></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <Link href="/admin/settings">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Configuração de Deslocamento</h2>
                    <p className="text-neutral-500">Parâmetros para cálculo automático de custo de Km.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 max-w-4xl">

                {/* Origin */}
                <Card title="Origem Base" icon={<MapPin className="h-5 w-5 text-blue-500" />}>
                    <div className="space-y-2">
                        <Label>Endereço Fixo (Saída dos Técnicos)</Label>
                        <Input
                            value={settings.origin_address}
                            onChange={e => handleChange('origin_address', e.target.value)}
                        />
                        <p className="text-xs text-neutral-500">Usado como ponto de partida para todos os chamados.</p>
                    </div>
                    <div className="space-y-2 mt-4">
                        <Label>Multiplicador de Distância</Label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="multiplier"
                                    checked={settings.displacement_multiplier == "1"}
                                    onChange={() => handleChange('displacement_multiplier', "1")}
                                    className="text-primary-600"
                                /> Só Ida (1x)
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="multiplier"
                                    checked={settings.displacement_multiplier == "2"}
                                    onChange={() => handleChange('displacement_multiplier', "2")}
                                    className="text-primary-600"
                                /> Ida e Volta (2x)
                            </label>
                        </div>
                    </div>
                </Card>

                {/* Vehicle */}
                <Card title="Veículo Padrão" icon={<Car className="h-5 w-5 text-orange-500" />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Consumo Médio (km/L)</Label>
                            <Input
                                type="number" step="0.1"
                                value={settings.vehicle_fuel_consumption}
                                onChange={e => handleChange('vehicle_fuel_consumption', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Custo Manutenção/Pneus (R$/km)</Label>
                            <Input
                                type="number" step="0.01"
                                value={settings.maintenance_tires_cost_km}
                                onChange={e => handleChange('maintenance_tires_cost_km', e.target.value)}
                            />
                        </div>
                    </div>
                </Card>

                {/* Depreciation */}
                <Card title="Depreciação" icon={<Info className="h-5 w-5 text-purple-500" />}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Valor Atual do Carro (R$)</Label>
                            <Input
                                type="number"
                                value={settings.vehicle_value_current}
                                onChange={e => handleChange('vehicle_value_current', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Valor Residual Final (R$)</Label>
                            <Input
                                type="number"
                                value={settings.vehicle_value_residual}
                                onChange={e => handleChange('vehicle_value_residual', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Ciclo de Vida (km)</Label>
                            <Input
                                type="number"
                                value={settings.vehicle_km_lifecycle}
                                onChange={e => handleChange('vehicle_km_lifecycle', e.target.value)}
                            />
                        </div>
                    </div>
                    <p className="text-xs text-neutral-500 mt-2">Fórmula: (Valor Atual - Valor Residual) / Ciclo de Vida</p>
                </Card>

                {/* Gas Price */}
                <Card title="Combustível" icon={<DollarSign className="h-5 w-5 text-green-500" />}>
                    <div className="space-y-2">
                        <Label>Preço Gasolina (Fallback/Fixo)</Label>
                        <Input
                            type="number" step="0.01"
                            value={settings.gas_price_fallback}
                            onChange={e => handleChange('gas_price_fallback', e.target.value)}
                        />
                        <p className="text-xs text-neutral-500">Usado se a API de preço médio falhar ou não tiver histórico.</p>
                    </div>
                </Card>

                <div className="flex justify-end pt-4">
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-primary-600 hover:bg-primary-700 text-white min-w-[200px]"
                    >
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Salvar Configurações
                    </Button>
                </div>

            </div>
        </div>
    );
}

function Card({ title, icon, children }: { title: string, icon: any, children: React.ReactNode }) {
    return (
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-6 border-b border-neutral-100 dark:border-neutral-800 pb-4 flex items-center gap-2">
                {icon} {title}
            </h3>
            {children}
        </div>
    );
}
