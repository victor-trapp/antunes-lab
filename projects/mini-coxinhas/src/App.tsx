import { useEffect, useMemo, useRef, useState, useCallback } from 'react';

const heroImage = '/images/hero.jpg';

const navItems = [
  { href: '#home', label: 'Início' },
  { href: '#produtos', label: 'Produtos' },
  { href: '#contato', label: 'Contato' }
];

type MenuItem = {
  image: string;
  alt: string;
  title: string;
  description?: string;
  imagePosition?: string;
};

type MenuSection = {
  id: string;
  title: string;
  subtitle?: string;
  items: MenuItem[];
};

// All menu content lives here
// to update what shows up in the card strips.
const menuSections: MenuSection[] = [
  {
    id: 'coxinhas',
    title: 'Coxinhas',
    subtitle: 'Sabores clássicos e especiais',
    items: [
      { image: '/images/produto-coxinha-frango.jpg', alt: 'Coxinha de frango', title: 'Frango', description: 'Recheio cremoso de frango desfiado temperado na medida certa.' },
      { image: '/images/coxinha-carne.jpeg', alt: 'Coxinha de carne', title: 'Carne', description: 'Carne moída suculenta com temperos especiais da casa.' },
      { image: '/images/coxinha-calabresa.jpeg', alt: 'Coxinha de calabresa', title: 'Calabresa', description: 'Calabresa levemente apimentada com um toque defumado.' },
      { image: '/images/coxinha-queijo.jpeg', alt: 'Coxinha de queijo', title: 'Queijo', description: 'Queijo derretido por dentro, crocante por fora.' },
      { image: '/images/coxinha-presuntoqueijo.jpeg', alt: 'Coxinha de presunto e queijo', title: 'Presunto & Queijo', description: 'O clássico irresistível que agrada todo mundo.' },
      { image: '/images/coxinha-docedeleite.jpeg', alt: 'Coxinha de doce de leite', title: 'Doce de leite', description: 'Versão adocicada com doce de leite cremoso no recheio.' },
      { image: '/images/coxinha-nutela.jpeg', alt: 'Coxinha de nutela', title: 'Nutela', description: 'Massa crocante recheada com generosa camada de nutela.', imagePosition: 'center 28%' }
    ]
  },
  {
    id: 'pasteis',
    title: 'Pastéis',
    subtitle: 'Doces e salgados',
    items: [
      { image: '/images/pastel-frango.jpeg', alt: 'Pastel de frango', title: 'Frango', description: 'Massa fininha e crocante com frango cremoso.' },
      { image: '/images/pastel-carne.jpeg', alt: 'Pastel de carne', title: 'Carne', description: 'Carne temperada com ervas frescas e muito sabor.' },
      { image: '/images/pastel-pizza.jpeg', alt: 'Pastel de pizza', title: 'Pizza', description: 'Molho, queijo e uma surpresa boa dentro de cada mordida.' },
      { image: '/images/pastel-brocolis.jpeg', alt: 'Pastel de brócolis', title: 'Brócolis', description: 'Opção leve com brócolis e queijo numa combinação perfeita.' },
      { image: '/images/pastel-banana.jpeg', alt: 'Pastel de banana', title: 'Banana', description: 'Banana caramelizada com canela pra adoçar o dia.' },
      { image: '/images/pastel-chocolate.jpeg', alt: 'Pastel de chocolate', title: 'Chocolate', description: 'Chocolate quente derretendo no centro da massa crocante.', imagePosition: 'center 28%' }
    ]
  },
  {
    id: 'outros',
    title: 'Outros',
    subtitle: 'Pra completar o pedido',
    items: [
      { image: '/images/batata-frita.jpeg', alt: 'Batata frita', title: 'Batata frita', description: 'Crocante, dourada e temperada do jeito que tem que ser.' },
      { image: '/images/salsichinha.jpeg', alt: 'Salsichinha', title: 'Salsichinha', description: 'Irresistível, perfeita pra petiscar.' },
      { image: '/images/produto-bolinha-queijo.jpg', alt: 'Bolinha de queijo', title: 'Bolinha de queijo', description: 'Queijo derretido por dentro, casquinha dourada por fora.' }
    ]
  }
];

function useScrollReveal(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12, ...options }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

function RevealSection({
  children,
  className = '',
  delay = 0,
  direction = 'up'
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'fade';
}) {
  const { ref, visible } = useScrollReveal();

  const transforms: Record<string, string> = {
    up: 'translateY(48px)',
    left: 'translateX(-48px)',
    right: 'translateX(48px)',
    fade: 'translateY(0)'
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate(0)' : transforms[direction],
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`
      }}
    >
      {children}
    </div>
  );
}

// CSS 3D flip — front shows the photo, back shows the description.
function FlipCard({ item, sectionId }: { item: MenuItem; sectionId: string }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <article
      data-card
      className="snap-start shrink-0 cursor-pointer
        w-[80vw] sm:w-[260px] md:w-[300px] lg:w-[calc((100%-48px)/3)]"
      style={{ perspective: '1200px' }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped(f => !f)}
      aria-label={`${item.title} — clique para ver detalhes`}
    >
      <div className="relative w-full" style={{ paddingTop: '125%' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s cubic-bezier(0.22,1,0.36,1)',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Front face */}
          <div
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            className="absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-amber-200/60 bg-white shadow-[0_12px_40px_-16px_rgba(217,119,6,0.3)]"
          >
            <div className="relative h-[83%] overflow-hidden">
              <img
                src={item.image}
                alt={item.alt}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                style={{ objectPosition: item.imagePosition ?? 'center 38%' }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/5 to-transparent" />
            </div>
            <div className="px-3 sm:px-4 pt-2 pb-2.5 flex items-center justify-between">
              <h4 className="text-sm font-bold text-stone-800 tracking-tight leading-tight">{item.title}</h4>
              <span className="text-[10px] sm:text-xs text-amber-600 font-semibold opacity-70 shrink-0 ml-2">ver →</span>
            </div>
          </div>

          {/* Back face */}
          <div
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
            className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 flex flex-col items-center justify-center p-5 sm:p-6 text-center"
          >
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">✦</div>
            <h4 className="text-lg sm:text-xl font-bold text-white mb-2 tracking-tight">{item.title}</h4>
            <p className="text-xs sm:text-sm text-orange-100 leading-relaxed max-w-[180px]">
              {item.description ?? 'Feito com ingredientes frescos e muito amor.'}
            </p>
            <div className="mt-4 h-px w-8 bg-white/40" />
            <p className="mt-2.5 text-[10px] sm:text-xs text-orange-200 uppercase tracking-widest">Mini Coxinhas</p>
          </div>
        </div>
      </div>
    </article>
  );
}

function App(): JSX.Element {
  const [loaded, setLoaded] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const year = useMemo(() => new Date().getFullYear(), []);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Preloader stays up until window load fires, then CSS slides it away.
  useEffect(() => {
    const onLoad = (): void => setLoaded(true);
    if (document.readyState === 'complete') setLoaded(true);
    else window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    const onScroll = (): void => setIsScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = !loaded || isNavOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [loaded, isNavOpen]);

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsNavOpen(false); };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, []);

  const closeNav = useCallback(() => setIsNavOpen(false), []);

  // Whatsapp connection
  const whatsAppMessage = encodeURIComponent('Oi! Vim pelo site da Mini Coxinhas e quero fazer um pedido.');
  const whatsAppHref = `https://wa.me/+5548933806781?text=${whatsAppMessage}`;

  const scrollSectionByCards = (sectionId: string, direction: 'left' | 'right'): void => {
    const el = sectionRefs.current[sectionId];
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-card]');
    const cardWidth = card ? card.offsetWidth : 340;
    const cardsToScroll = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
    el.scrollBy({ left: direction === 'right' ? cardWidth * cardsToScroll + 24 * cardsToScroll : -(cardWidth * cardsToScroll + 24 * cardsToScroll), behavior: 'smooth' });
  };

  return (
    <>
      <div className={`preload ${loaded ? 'loaded' : ''}`}>
        <div className="flex flex-col items-center gap-4">
          <img src="/images/minicoxinhaslogo.png" alt="Logo Mini Coxinhas" className="h-20 w-20 rounded-2xl bg-white p-2 object-contain shadow-xl shadow-amber-300/40 ring-1 ring-amber-200" />
          <div className="spinner" />
          <p className="tracking-[0.35em] text-sm uppercase text-amber-800/70 font-medium">Mini Coxinhas</p>
        </div>
      </div>

      <header className="fixed left-0 right-0 top-0 z-40">
        <div className="mx-auto max-w-6xl px-4">
          <div className={[
            'nav-pill mt-4 flex h-16 items-center justify-between gap-3 rounded-2xl px-3 transition-all duration-500 md:px-5',
            isScrolled
              ? 'nav-scrolled border border-amber-200/60 bg-white/90 shadow-[0_8px_32px_-8px_rgba(217,119,6,0.25)] backdrop-blur-xl'
              : 'border border-white/20 bg-white/30 shadow-[0_4px_24px_-8px_rgba(217,119,6,0.1)] backdrop-blur-md'
          ].join(' ')}>

            <a href="#home" className="group flex items-center gap-2.5 rounded-xl px-1 py-1">
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src="/images/minicoxinhaslogo.png"
                  alt="Logo Mini Coxinhas"
                  className="h-9 w-9 rounded-xl bg-white p-1 object-contain ring-1 ring-amber-200 transition duration-300 group-hover:scale-110"
                />
              </div>
              <div className="leading-tight">
                <p className="font-black text-stone-800 tracking-tight text-sm transition duration-300 group-hover:text-amber-600" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  Mini Coxinhas
                </p>
              </div>
            </a>

            <nav className="hidden md:flex items-center bg-stone-100/70 rounded-xl px-1.5 py-1.5 gap-0.5">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="nav-link relative px-4 py-1.5 text-sm font-semibold text-stone-600 rounded-lg transition-all duration-200 hover:text-amber-700 hover:bg-white hover:shadow-sm"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-2">
              <a
                href={whatsAppHref}
                target="_blank"
                rel="noreferrer"
                className="group relative overflow-hidden inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-amber-400/30 transition-all duration-300 hover:shadow-amber-400/50 hover:-translate-y-px"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <svg viewBox="0 0 24 24" className="relative h-4 w-4 fill-current shrink-0">
                  <path d="M19.05 4.94A9.86 9.86 0 0 0 12 2a10 10 0 0 0-8.67 14.97L2 22l5.18-1.3A10 10 0 1 0 19.05 4.94Z" />
                </svg>
                <span className="relative">WhatsApp</span>
              </a>
            </div>

            <button
              className={[
                'md:hidden relative inline-flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-xl border transition-all duration-300',
                isNavOpen
                  ? 'border-amber-300 bg-amber-50'
                  : 'border-amber-200/70 bg-white/60 hover:bg-white/80'
              ].join(' ')}
              aria-label={isNavOpen ? 'Fechar menu' : 'Abrir menu'}
              onClick={() => setIsNavOpen(p => !p)}
            >
              <span className={['block h-0.5 w-5 bg-amber-600 rounded-full transition-all duration-300 origin-center', isNavOpen ? 'rotate-45 translate-y-[7px]' : ''].join(' ')} />
              <span className={['block h-0.5 w-5 bg-amber-600 rounded-full transition-all duration-300', isNavOpen ? 'opacity-0 scale-x-0' : ''].join(' ')} />
              <span className={['block h-0.5 w-5 bg-amber-600 rounded-full transition-all duration-300 origin-center', isNavOpen ? '-rotate-45 -translate-y-[7px]' : ''].join(' ')} />
            </button>
          </div>
        </div>

        {isNavOpen && (
          <div className="fixed inset-0 z-50" onClick={closeNav}>
            <div className="absolute inset-0 bg-stone-900/30 backdrop-blur-sm" />
            <div
              className="mobile-drawer absolute right-0 top-0 h-full w-[82%] max-w-xs bg-white/98 p-6 shadow-2xl backdrop-blur-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <a href="#home" className="flex items-center gap-2.5" onClick={closeNav}>
                  <img src="/images/minicoxinhaslogo.png" alt="Logo" className="h-9 w-9 rounded-xl bg-white p-1 object-contain ring-1 ring-amber-200" />
                  <p className="font-black text-stone-800 text-sm" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Mini Coxinhas</p>
                </a>
                <button
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 text-stone-500 transition hover:bg-stone-50 hover:text-stone-800"
                  aria-label="Fechar"
                  onClick={closeNav}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col gap-1">
                {navItems.map((item, i) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={closeNav}
                    className="drawer-link flex items-center justify-between rounded-xl px-4 py-3.5 font-semibold text-stone-700 transition hover:bg-amber-50 hover:text-amber-700 group"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    {item.label}
                    <span className="text-stone-300 transition group-hover:text-amber-400 group-hover:translate-x-0.5 duration-200">→</span>
                  </a>
                ))}
              </div>

              <div className="my-6 h-px bg-stone-100" />

              <a
                href={whatsAppHref}
                target="_blank"
                rel="noreferrer"
                onClick={closeNav}
                className="flex items-center justify-center gap-2 w-full rounded-2xl bg-amber-500 px-4 py-3.5 font-bold text-white transition hover:bg-amber-600 shadow-lg shadow-amber-300/30"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current shrink-0">
                  <path d="M19.05 4.94A9.86 9.86 0 0 0 12 2a10 10 0 0 0-8.67 14.97L2 22l5.18-1.3A10 10 0 1 0 19.05 4.94Z" />
                </svg>
                Fazer pedido
              </a>
            </div>
          </div>
        )}
      </header>

      <main id="home">
        <section className="relative min-h-screen overflow-hidden">
          <div className="absolute inset-0">
            <img src={heroImage} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="hero-overlay-warm absolute inset-0" />

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid min-h-screen items-center pt-24 pb-32">
              <div className="flex max-w-2xl flex-col items-start">
                <div className="hero-logo-anim -mb-10 sm:-mb-16 md:-mb-24">
                  <img
                    src="/images/minicoxinhaslogo.png"
                    alt="Logo Mini Coxinhas"
                    className="h-40 w-40 sm:h-56 sm:w-56 md:h-[22rem] md:w-[22rem] object-contain"
                  />
                </div>

                <h1
                  className="hero-text-anim mt-0 text-[clamp(2rem,8vw,4rem)] font-black leading-[1.05] text-stone-900 tracking-tight"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Pequenas no tamanho,{' '}
                  <span className="text-amber-600 italic">gigantes no sabor</span>.
                </h1>

                <p className="hero-text-anim-delay mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-stone-700/90 leading-relaxed max-w-sm sm:max-w-lg">
                  Coxinhas e salgadinhos feitos com carinho. Perfeitos pra festa, reunião, ou aquele lanche que salva o dia.
                </p>

                <div className="hero-cta-anim mt-6 sm:mt-8 flex flex-col gap-3 w-full sm:w-auto sm:flex-row">
                  <a
                    href="#produtos"
                    className="inline-flex items-center justify-center rounded-2xl bg-amber-500 px-6 sm:px-7 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-white transition hover:bg-amber-600 shadow-xl shadow-amber-400/40 hover:-translate-y-0.5 duration-200"
                  >
                    Ver produtos
                  </a>
                  <a
                    href={whatsAppHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-2xl border-2 border-stone-200/60 bg-white/70 px-6 sm:px-7 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-stone-800 transition hover:bg-white/90 hover:-translate-y-0.5 duration-200 backdrop-blur"
                  >
                    Pedir no WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 left-0 right-0 z-10 flex justify-center">
            <a href="#produtos" className="scroll-cta group flex flex-col items-center gap-2 text-stone-600 hover:text-amber-600 transition-colors duration-300">
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">Ver produtos</span>
              <span className="scroll-chevron flex flex-col items-center gap-0.5">
                <svg viewBox="0 0 24 12" className="w-6 fill-none stroke-current stroke-[2.5] opacity-90" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="2,2 12,10 22,2" />
                </svg>
                <svg viewBox="0 0 24 12" className="w-6 fill-none stroke-current stroke-[2.5] opacity-50" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="2,2 12,10 22,2" />
                </svg>
              </span>
            </a>
          </div>
        </section>

        <section id="produtos" className="mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-20 lg:py-24">
          <RevealSection direction="up" className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-amber-600 font-bold">Cardápio</p>
              <h2
                className="mt-2 text-3xl font-black text-stone-800 sm:text-4xl lg:text-5xl tracking-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Escolha seus <span className="text-amber-600 italic">favoritos</span>
              </h2>
              <p className="mt-2 sm:mt-3 max-w-lg text-sm sm:text-base text-stone-600">
                Passe o mouse — ou toque — para descobrir cada sabor.
              </p>
            </div>
            <a
              href={whatsAppHref}
              target="_blank"
              rel="noreferrer"
              className="self-start sm:self-auto inline-flex items-center justify-center rounded-2xl border-2 border-amber-200 bg-white px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-bold text-amber-800 transition hover:bg-amber-50 hover:-translate-y-0.5 duration-200 shadow-md shadow-amber-100"
            >
              Pedir agora →
            </a>
          </RevealSection>

          <div className="mt-10 sm:mt-14 space-y-12 sm:space-y-16">
            {menuSections.map((section, si) => (
              <RevealSection key={section.id} direction="up" delay={si * 80}>
                <div className="flex items-center justify-between gap-4 mb-5 sm:mb-6">
                  <div>
                    <h3
                      className="text-xl sm:text-2xl font-black text-stone-800 tracking-tight"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {section.title}
                    </h3>
                    {section.subtitle && <p className="mt-0.5 text-xs sm:text-sm text-stone-500">{section.subtitle}</p>}
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => scrollSectionByCards(section.id, 'left')}
                      className="inline-flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl border-2 border-amber-200 bg-white text-amber-800 transition hover:bg-amber-50 hover:border-amber-400 font-bold text-sm"
                      aria-label={`Voltar ${section.title}`}
                    >←</button>
                    <button
                      type="button"
                      onClick={() => scrollSectionByCards(section.id, 'right')}
                      className="inline-flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl border-2 border-amber-200 bg-white text-amber-800 transition hover:bg-amber-50 hover:border-amber-400 font-bold text-sm"
                      aria-label={`Avançar ${section.title}`}
                    >→</button>
                  </div>
                </div>

                <div
                  ref={node => { sectionRefs.current[section.id] = node; }}
                  className="no-scrollbar flex gap-4 sm:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
                >
                  {section.items.map(item => (
                    <FlipCard key={`${section.id}-${item.title}`} item={item} sectionId={section.id} />
                  ))}
                </div>
              </RevealSection>
            ))}
          </div>
        </section>

        <section id="contato" className="border-t border-amber-200/40 bg-stone-50">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-20">
            <div className="grid gap-8 sm:gap-10 md:grid-cols-2">
              <RevealSection direction="left">
                <p className="text-xs uppercase tracking-[0.3em] text-amber-600 font-bold">Onde estamos</p>
                <h2
                  className="mt-2 text-2xl sm:text-3xl font-black text-stone-800 tracking-tight"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Contato
                </h2>
                <p className="mt-2 text-sm text-stone-500">Coloca aqui endereço e referências.</p>

                <div className="mt-5 sm:mt-6 space-y-3 sm:space-y-4 text-stone-700">
                  {[
                    { label: 'Endereço', value: 'R. Wâlter Vetterli - Lauro Müller, SC, 88880-000, Brasil' },
                    { label: 'Horário de atendimento', value: 'Seg. a Sex.: 14:00–22:00 | Sáb.: 14:00–19:00 | Dom.: Fechado' },
                    { label: 'WhatsApp', value: '+55 48 933806781' }
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="mt-0.5 h-5 w-5 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center flex-shrink-0">
                        <span className="text-amber-600 text-xs">✦</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-stone-400">{label}</p>
                        <p className="text-stone-700 font-medium text-sm sm:text-base">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </RevealSection>

              <RevealSection direction="right" delay={100}>
                <div className="rounded-2xl sm:rounded-3xl border-2 border-amber-200/60 bg-white p-6 sm:p-8 shadow-[0_20px_60px_-20px_rgba(217,119,6,0.2)]">
                  <p className="text-xs uppercase tracking-[0.3em] text-amber-600 font-bold">Pedidos</p>
                  <h3
                    className="mt-2 text-xl sm:text-2xl font-black text-stone-800 tracking-tight"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Faça seu pedido
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-stone-500 leading-relaxed">
                    Clique abaixo e fale direto pelo WhatsApp. Rápido, fácil e sem complicação.
                  </p>
                  <a
                    href={whatsAppHref}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 sm:mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-amber-500 px-6 py-3.5 sm:py-4 font-bold text-white transition hover:bg-amber-600 hover:-translate-y-0.5 duration-200 shadow-xl shadow-amber-300/40"
                  >
                    Abrir WhatsApp →
                  </a>
                </div>
              </RevealSection>
            </div>

            <RevealSection direction="up" delay={100} className="mt-12 sm:mt-16 flex flex-col items-center gap-3">
              <img src="/images/minicoxinhaslogo.png" alt="Logo Mini Coxinhas" className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-white p-1.5 object-contain ring-2 ring-amber-200 shadow-md" />
              <p className="text-sm font-bold text-stone-800 tracking-tight">Mini Coxinhas</p>
              <p className="text-xs text-stone-400">© {year} Mini Coxinhas. Todos os direitos reservados.</p>
            </RevealSection>
          </div>
        </section>
      </main>

      <a href={whatsAppHref} target="_blank" rel="noreferrer" aria-label="Chamar no WhatsApp" className="whatsapp-fab fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_36px_-12px_rgba(37,211,102,0.9)] transition hover:scale-110 hover:bg-[#20bf5b] duration-200">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-current">
          <path d="M19.05 4.94A9.86 9.86 0 0 0 12 2a10 10 0 0 0-8.67 14.97L2 22l5.18-1.3A10 10 0 1 0 19.05 4.94ZM12 20a7.93 7.93 0 0 1-4.04-1.1l-.29-.17-3.07.77.82-2.99-.19-.31A8 8 0 1 1 12 20Zm4.4-5.95c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12s-.62.78-.76.94c-.14.16-.28.18-.52.06a6.43 6.43 0 0 1-1.9-1.17 7.12 7.12 0 0 1-1.3-1.62c-.14-.24-.01-.36.1-.48.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.4h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.58 4.12 3.62.58.25 1.03.4 1.38.52.58.19 1.1.16 1.52.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
        </svg>
      </a>
    </>
  );
}

export default App;
