import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ConsultButton } from '@/components/leads/ConsultButton'
import { Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface CTASectionProps {
    locale: Locale
    title?: string
    description?: string
    buttonText?: string
    source?: string
    className?: string
    backgroundImage?: string
}

export function CTASection({
    locale,
    title = '準備好開始了嗎？',
    description,
    buttonText = '立即諮詢',
    source = 'cta-section',
    className,
    backgroundImage = '/assets/seed/presentation-slide-05.png',
}: CTASectionProps) {
    return (
        <section className={cn("py-24 md:py-32", className)}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative rounded-3xl overflow-hidden section-accent">
                    {/* Background Image */}
                    {backgroundImage && (
                        <div className="absolute inset-0 z-0">
                           <img 
                             src={backgroundImage} 
                             alt="" 
                             className="w-full h-full object-cover opacity-10 mix-blend-overlay"
                           />
                           <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--brand-crimson)/0.9)] to-[hsl(var(--brand-gold)/0.9)] mix-blend-multiply" />
                        </div>
                    )}

                    {/* Decorative elements */}
                    <div className="absolute inset-0 overflow-hidden z-0">
                        <div className="absolute -top-[30%] -right-[10%] w-[50%] h-[80%] rounded-full bg-[hsl(40_42%_48%/0.2)] blur-[80px]" />
                        <div className="absolute -bottom-[20%] -left-[5%] w-[40%] h-[60%] rounded-full bg-[hsl(348_50%_45%/0.2)] blur-[60px]" />
                    </div>
                    {/* Subtle grid pattern */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: 'linear-gradient(hsl(0 0% 100% / 0.1) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 0.1) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }} />

                    <div className="relative p-10 md:p-20 z-10 flex flex-col items-center text-center">
                        <div className="max-w-3xl">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif tracking-tight text-white drop-shadow-sm leading-tight text-balance">
                                {title}
                            </h2>
                            {description ? (
                                <p className="mt-5 text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
                                    {description}
                                </p>
                            ) : null}
                            <div className="mt-10">
                                <ConsultButton
                                    locale={locale}
                                    size="lg"
                                    className="bg-[hsl(40,42%,48%)] text-[hsl(28,18%,6%)] hover:bg-[hsl(40,42%,55%)] font-semibold shadow-lg shadow-[hsl(40_42%_48%/0.2) px-8 py-6 text-lg]"
                                    source={`/${locale}?source=${source}`}
                                >
                                    <span className="inline-flex items-center gap-2">
                                        {buttonText}
                                        <ArrowRight className="h-5 w-5" />
                                    </span>
                                </ConsultButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
