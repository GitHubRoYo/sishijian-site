'use client'

import Image from 'next/image'
import { brandCategories } from './brandWall.data'

const categoryStyles = {
  gold: {
    border: 'border-[hsl(40_42%_48%/0.25)]',
    title: 'text-[hsl(40,48%,60%)]',
    accent: 'bg-[hsl(40,42%_48%/0.05)]',
    dot: 'bg-[hsl(40,48%,55%)]',
  },
  red: {
    border: 'border-[hsl(348_50%_30%/0.25)]',
    title: 'text-[hsl(348,50%,50%)]',
    accent: 'bg-[hsl(348,50%,30%/0.05)]',
    dot: 'bg-[hsl(348,50%,42%)]',
  },
  blue: {
    border: 'border-[hsl(210_55%_45%/0.25)]',
    title: 'text-[hsl(210,55%,58%)]',
    accent: 'bg-[hsl(210,55%,45%/0.05)]',
    dot: 'bg-[hsl(210,55%,50%)]',
  },
}

export function BrandWall() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {brandCategories.map((category) => {
        const style = categoryStyles[category.color]
        return (
          <div
            key={category.title}
            className={`rounded-2xl border ${style.border} ${style.accent} p-6 lg:p-7 backdrop-blur-sm`}
          >
            {/* Category header */}
            <div className="mb-6">
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                <h3 className={`text-base font-semibold tracking-wide ${style.title}`}>
                  {category.title}
                </h3>
              </div>
              <p className="text-[13px] text-white/35 ml-[18px]">{category.description}</p>
            </div>

            {/* Logo grid */}
            <div className="grid grid-cols-4 gap-2.5">
              {category.brands.map((brand) => (
                <div
                  key={brand.name}
                  className="group relative flex items-center justify-center rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.04] hover:border-[hsl(var(--brand-gold)/0.3)] transition-all duration-300 aspect-[2.2/1] overflow-hidden hover:shadow-[0_0_15px_-3px_hsl(var(--brand-gold)/0.15)]"
                  title={brand.name}
                >
                  {brand.logo ? (
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain p-2 opacity-60 group-hover:opacity-100 transition-opacity duration-300 contrast-[0.9] group-hover:contrast-100"
                      sizes="100px"
                    />
                  ) : (
                    <span className="text-[9px] font-medium text-white/40 group-hover:text-[hsl(var(--brand-gold))] text-center leading-tight px-1.5 transition-colors duration-300">
                      {brand.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
