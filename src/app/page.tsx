import { HeroSection } from "@/components/landing/HeroSection";
import { Shield, Clock, Award, Hammer, PenTool, Droplets, PaintBucket, HardHat } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <HeroSection />

      {/* Services Grid (Bento Style) */}
      <section id="services" className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-base font-bold text-secondary-600 uppercase tracking-wide">Nossos Serviços</h2>
            <h3 className="mt-2 text-3xl font-extrabold text-primary-950 sm:text-4xl">Soluções Completas para seu Imóvel</h3>
            <p className="mt-4 text-lg text-neutral-600">Manutenção preventiva e corretiva com profissionais treinados e tecnologia de ponta.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ServiceCard title="Elétrica" icon={ZapIcon} desc="Instalações, quadros e reparos." color="bg-yellow-100 text-yellow-700" />
            <ServiceCard title="Hidráulica" icon={Droplets} desc="Vazamentos, reparos e instalações." color="bg-blue-100 text-blue-700" />
            <ServiceCard title="Pintura" icon={PaintBucket} desc="Acabamento fino e revitalização." color="bg-purple-100 text-purple-700" />
            <ServiceCard title="Reformas" icon={Hammer} desc="Pequenas obras e alvenaria." color="bg-orange-100 text-orange-700" />
            <ServiceCard title="Manutenção" icon={PenTool} desc="Preventiva para condomínios." color="bg-green-100 text-green-700" />
            <ServiceCard title="Gesso" icon={HardHat} desc="Sancas, divisórias e reparos." color="bg-stone-100 text-stone-700" />
          </div>
        </div>
      </section>

      {/* Trust/Process Section */}
      <section id="process" className="py-24 bg-primary-950 text-white relative overflow-hidden">
        {/* Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Processo Simples e Transparente</h2>
              <p className="text-primary-200 text-lg mb-8">Esqueça a dor de cabeça com obras. Aqui você tem previsibilidade, contrato e garantia.</p>

              <div className="space-y-8">
                <ProcessStep number="01" title="Solicite Online" desc="Abra seu chamado em 30 segundos pelo site ou App." />
                <ProcessStep number="02" title="Orçamento Rápido" desc="Receba uma estimativa ou visita técnica em até 02 horas." />
                <ProcessStep number="03" title="Execução Monitorada" desc="Acompanhe o técnico em tempo real e aprove o serviço." />
                <ProcessStep number="04" title="Pagamento Seguro" desc="Pague via PIX ou Cartão somente após a conclusão." />
              </div>
            </div>
            <div className="mt-12 lg:mt-0 relative">
              <div className="bg-primary-900 rounded-2xl p-8 border border-primary-800 shadow-2xl">
                <div className="space-y-4">
                  <div className="h-8 w-2/3 bg-primary-800 rounded animate-pulse" />
                  <div className="h-4 w-full bg-primary-800 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-primary-800 rounded animate-pulse" />
                  <div className="h-32 w-full bg-primary-800 rounded animate-pulse mt-8" />
                </div>
                {/* Floating Badge */}
                <div className="absolute -right-6 top-10 bg-secondary-500 text-white p-4 rounded-lg shadow-lg">
                  <p className="font-bold text-2xl">4.9/5</p>
                  <p className="text-xs font-medium opacity-90">Satisfação Clientes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ title, icon: Icon, desc, color }: any) {
  return (
    <div className="group relative bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${color} group-hover:scale-110 transition-transform`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold text-neutral-900 mb-2">{title}</h3>
      <p className="text-sm text-neutral-500">{desc}</p>
    </div>
  )
}

function ProcessStep({ number, title, desc }: any) {
  return (
    <div className="flex gap-4">
      <span className="text-3xl font-black text-primary-800">{number}</span>
      <div>
        <h4 className="text-xl font-bold text-white">{title}</h4>
        <p className="text-primary-300 text-sm mt-1">{desc}</p>
      </div>
    </div>
  )
}

function ZapIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}
