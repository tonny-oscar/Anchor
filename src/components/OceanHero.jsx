const WAVE_PATH = 'M0 40 C 150 10 350 10 500 40 C 650 70 850 70 1000 40 C 1150 10 1350 10 1500 40 C 1650 70 1850 70 2000 40 V 80 H 0 Z';

export function Waves({ fill = '#f3f8f9', className = '' }) {
  return (
    <div className={`absolute inset-x-0 bottom-0 h-12 md:h-16 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      <svg className="absolute bottom-0 w-[200%] h-full animate-drift-slow opacity-50" viewBox="0 0 2000 80" preserveAspectRatio="none">
        <path d={WAVE_PATH} fill={fill} />
      </svg>
      <svg className="absolute bottom-0 w-[200%] h-3/4 animate-drift" viewBox="0 0 2000 80" preserveAspectRatio="none">
        <path d={WAVE_PATH} fill={fill} />
      </svg>
    </div>
  );
}

const sizes = {
  sm: 'pt-10 pb-20 md:pt-14 md:pb-24',
  md: 'pt-14 pb-24 md:pt-20 md:pb-32',
  lg: 'pt-24 pb-32 md:pt-36 md:pb-48',
};

export default function OceanHero({ image, eyebrow, title, subtitle, children, size = 'md', position = 'center' }) {
  return (
    <section className="relative overflow-hidden bg-abyss-900 text-white">
      <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: position }} />
      <div className="absolute inset-0 bg-gradient-to-r from-abyss-950/85 via-abyss-900/55 to-abyss-900/15" />
      <div className={`relative max-w-6xl mx-auto px-4 ${sizes[size]}`}>
        <div className="max-w-2xl animate-rise">
          {eyebrow && <p className="text-xs font-bold tracking-[0.18em] uppercase text-calm-200 mb-3">{eyebrow}</p>}
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-3">{title}</h1>
          {subtitle && <p className="text-lg text-abyss-100/90">{subtitle}</p>}
          {children && <div className="mt-6">{children}</div>}
        </div>
      </div>
      <Waves />
    </section>
  );
}
