import { useEffect, useMemo, useRef, useState } from 'react';

const heroImages = ['/images/hero-1.jpg', '/images/hero-2.jpg', '/images/hero-3.jpg'];

const navItems = [
  { href: '#home', label: 'Início' },
  { href: '#produtos', label: 'Produtos' },
  { href: '#contato', label: 'Contato' }
];

type MenuItem = {
  image: string;
  alt: string;
  title: string;
};

type MenuSection = {
  id: string;
  title: string;
  subtitle?: string;
  items: MenuItem[];
};

const menuSections: MenuSection[] = [
  {
    id: 'coxinhas',
    title: 'Coxinhas',
    subtitle: 'Sabores clássicos e especiais',
    items: [
      { image: '/images/produto-coxinha-frango.jpg', alt: 'Coxinha de frango', title: 'Frango' },
      { image: '/images/coxinha-carne.jpeg', alt: 'Coxinha de carne', title: 'Carne' },
      { image: '/images/coxinha-calabresa.jpeg', alt: 'Coxinha de calabresa', title: 'Calabresa' },
      { image: '/images/coxinha-queijo.jpeg', alt: 'Coxinha de queijo', title: 'Queijo' },
      { image: '/images/coxinha-presuntoqueijo.jpeg', alt: 'Coxinha de presunto e queijo', title: 'Presunto & Queijo' },
      { image: '/images/coxinha-docedeleite.jpeg', alt: 'Coxinha de doce de leite', title: 'Doce de leite' },
      { image: '/images/coxinha-nutela.jpeg', alt: 'Coxinha de nutela', title: 'Nutela' }
    ]
  },
  {
    id: 'pasteis',
    title: 'Pastéis',
    subtitle: 'Doces e salgados',
    items: [
      { image: '/images/pastel-frango.jpeg', alt: 'Pastel de frango', title: 'Frango' },
      { image: '/images/pastel-carne.jpeg', alt: 'Pastel de carne', title: 'Carne' },
      { image: '/images/pastel-pizza.jpeg', alt: 'Pastel de pizza', title: 'Pizza' },
      { image: '/images/pastel-brocolis.jpeg', alt: 'Pastel de brócolis', title: 'Brócolis' },
      { image: '/images/pastel-banana.jpeg', alt: 'Pastel de banana', title: 'Banana' },
      { image: '/images/pastel-chocolate.jpeg', alt: 'Pastel de chocolate', title: 'Chocolate' }
    ]
  },
  {
    id: 'outros',
    title: 'Outros',
    subtitle: 'Pra completar o pedido',
    items: [
      { image: '/images/batata-frita.jpeg', alt: 'Batata frita', title: 'Batata frita' },
      { image: '/images/salsichinha.jpeg', alt: 'Salsichinha', title: 'Salsichinha' },
      { image: '/images/produto-bolinha-queijo.jpg', alt: 'Bolinha de queijo', title: 'Bolinha de queijo' }
    ]
  }
];

function App(): JSX.Element {
  const [loaded, setLoaded] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const year = useMemo(() => new Date().getFullYear(), []);

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

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
    if (heroImages.length <= 1) return;

    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const shouldLockBody = !loaded || isNavOpen;
    document.body.style.overflow = shouldLockBody ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [loaded, isNavOpen]);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setIsNavOpen(false);
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, []);

  const closeNav = (): void => setIsNavOpen(false);
  const whatsAppMessage = encodeURIComponent('Oi! Vim pelo site da Mini Coxinhas e quero fazer um pedido.');
  const whatsAppHref = `https://wa.me/55SEUNUMERO?text=${whatsAppMessage}`;

  const goPrevSlide = (): void => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const goNextSlide = (): void => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const scrollSectionByCards = (sectionId: string, direction: 'left' | 'right'): void => {
    const el = sectionRefs.current[sectionId];
    if (!el) return;

    const card = el.querySelector<HTMLElement>('[data-card]');
    const cardWidth = card ? card.offsetWidth : 380;

    const cardsToScroll = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
    const delta = cardWidth * cardsToScroll + 24 * cardsToScroll;

    el.scrollBy({
      left: direction === 'right' ? delta : -delta,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <div className={`preload ${loaded ? 'loaded' : ''}`}>
        <div className="flex flex-col items-center gap-4">
          <img
            src="/images/minicoxinhaslogo.png"
            alt="Logo Mini Coxinhas"
            className="h-20 w-20 rounded-2xl bg-white p-2 object-contain shadow-xl shadow-orange-300/30 ring-1 ring-orange-200"
          />
          <div className="spinner" />
          <p className="tracking-[0.35em] text-sm uppercase text-orange-800/70">Mini Coxinhas</p>
        </div>
      </div>

      <header className="fixed left-0 right-0 top-0 z-40">
        <div className="mx-auto max-w-6xl px-4">
          <div
            className={[
              'mt-4 flex h-16 items-center justify-between gap-3 rounded-2xl border px-3 backdrop-blur-md transition-all duration-300 md:px-5',
              isScrolled
                ? 'border-white/45 bg-white/70 shadow-[0_18px_60px_-30px_rgba(255,115,22,0.55)]'
                : 'border-white/25 bg-white/40 shadow-[0_18px_60px_-40px_rgba(255,115,22,0.35)]'
            ].join(' ')}
          >
            <a href="#home" className="flex items-center gap-3 rounded-xl px-1 py-1 transition hover:bg-white/30">
              <img
                src="/images/minicoxinhaslogo.png"
                alt="Logo Mini Coxinhas"
                className="h-10 w-10 rounded-xl bg-white p-1 object-contain ring-1 ring-orange-200"
              />
              <div className="leading-tight">
                <p className="font-semibold text-orange-950">Mini Coxinhas</p>
                <p className="text-xs text-orange-800/70">Sabor artesanal</p>
              </div>
            </a>

            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-orange-950/70">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} className="hover:text-orange-600 transition">
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-2">
              <a
                href="#produtos"
                className="inline-flex items-center rounded-xl border border-orange-200/80 bg-white/70 px-4 py-2 text-sm font-semibold text-orange-800 hover:bg-orange-50 transition"
              >
                Cardápio
              </a>

              <a
                href={whatsAppHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition shadow-lg shadow-orange-300/40"
              >
                WhatsApp
              </a>
            </div>

            <button
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-orange-200/70 bg-white/60 transition hover:bg-white/80"
              aria-label={isNavOpen ? 'Fechar menu' : 'Abrir menu'}
              onClick={() => setIsNavOpen((prev) => !prev)}
            >
              <span className="block h-0.5 w-5 bg-orange-600" />
            </button>
          </div>
        </div>

        {isNavOpen ? (
          <div className="fixed inset-0 z-50" onClick={closeNav}>
            <div className="absolute inset-0 bg-white/70 backdrop-blur" />

            <div
              className="absolute right-0 top-0 h-full w-[86%] max-w-sm border-l border-orange-200 bg-white/90 p-5 backdrop-blur"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <a href="#home" className="flex items-center gap-3" onClick={closeNav}>
                  <img
                    src="/images/minicoxinhaslogo.png"
                    alt="Logo Mini Coxinhas"
                    className="h-10 w-10 rounded-xl bg-white p-1 object-contain ring-1 ring-orange-200"
                  />
                  <div>
                    <p className="font-semibold text-orange-950">Mini Coxinhas</p>
                    <p className="text-xs text-orange-700/70">Menu</p>
                  </div>
                </a>

                <button
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-orange-200 bg-white/70 transition hover:bg-orange-50"
                  aria-label="Fechar menu"
                  onClick={closeNav}
                >
                  ✕
                </button>
              </div>

              <div className="mt-6 flex flex-col gap-2 text-orange-900">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    className="rounded-xl px-3 py-3 transition hover:bg-orange-50"
                    href={item.href}
                    onClick={closeNav}
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-orange-200 bg-white/70 p-4">
                <p className="text-sm text-orange-800/80">Pedidos / WhatsApp</p>
                <a
                  className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-orange-500 px-4 py-2 font-semibold text-white transition hover:bg-orange-600"
                  href={whatsAppHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  Chamar no WhatsApp
                </a>
              </div>
            </div>
          </div>
        ) : null}
      </header>

      <main id="home">
        <section className="relative min-h-screen overflow-hidden">
          <div className="absolute inset-0">
            {heroImages.map((image, index) => (
              <div key={image} className={`slide absolute inset-0 ${index === currentSlide ? 'active' : ''}`}>
                <img src={image} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>

          <div className="hero-overlay-light absolute inset-0" />

          <div className="relative mx-auto max-w-6xl px-4">
            <div className="grid min-h-screen items-center pt-8 md:pt-10">
              <div className="-translate-y-14 md:-translate-y-20 flex max-w-2xl flex-col items-start">
                <img
                  src="/images/minicoxinhaslogo.png"
                  alt="Logo Mini Coxinhas"
                  className="-mb-16 h-[18rem] w-[18rem] object-contain md:-mb-24 md:h-[27rem] md:w-[27rem]"
                />

                <h1 className="hero-title-shadow-dark mt-0 text-4xl font-semibold leading-tight text-orange-950 md:text-6xl">
                  Pequenas no tamanho, <span className="text-orange-700">gigantes no sabor</span>.
                </h1>

                <p className="hero-subtitle-shadow mt-5 text-base text-orange-950/90 md:text-lg">
                  Coxinhas e salgadinhos feitos com carinho. Perfeitos pra festa, reunião, ou aquele lanche que salva o dia.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#produtos"
                    className="inline-flex items-center justify-center rounded-2xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 shadow-lg shadow-orange-300/40"
                  >
                    Ver produtos
                  </a>

                  <a
                    href={whatsAppHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-2xl border border-orange-200 bg-white/65 px-6 py-3 font-semibold text-orange-900 transition hover:bg-white/80"
                  >
                    Fazer pedido no WhatsApp
                  </a>
                </div>

              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-8 z-20 mx-auto max-w-6xl px-4">
            <div className="flex items-center justify-between">
              <button
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/25 bg-white/10 text-white transition hover:bg-white/15"
                aria-label="Slide anterior"
                onClick={goPrevSlide}
              >
                ←
              </button>

              <a href="#produtos" className="text-sm text-black transition hover:text-orange-700">
                Descer para produtos ↓
              </a>

              <button
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/25 bg-white/10 text-white transition hover:bg-white/15"
                aria-label="Próximo slide"
                onClick={goNextSlide}
              >
                →
              </button>
            </div>
          </div>
        </section>

        <section id="produtos" className="mx-auto max-w-6xl px-4 py-20">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-orange-600">Produtos</p>
              <h2 className="mt-2 text-3xl font-semibold text-orange-950 md:text-4xl">Escolha seus favoritos</h2>
              <p className="mt-3 max-w-2xl text-orange-900/75">
                Veja 3 sabores por vez e clique nas setas para descobrir os outros.
              </p>
            </div>

            <a
              href={whatsAppHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-2xl border border-orange-200 bg-white/70 px-6 py-3 font-semibold text-orange-800 transition hover:bg-orange-50"
            >
              Pedir agora no WhatsApp
            </a>
          </div>

          <div className="mt-12 space-y-14">
            {menuSections.map((section) => (
              <div key={section.id}>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-orange-950">{section.title}</h3>
                    {section.subtitle ? <p className="mt-1 text-sm text-orange-900/65">{section.subtitle}</p> : null}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => scrollSectionByCards(section.id, 'left')}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-orange-200 bg-white/70 text-orange-900 transition hover:bg-orange-50"
                      aria-label={`Voltar ${section.title}`}
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollSectionByCards(section.id, 'right')}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-orange-200 bg-white/70 text-orange-900 transition hover:bg-orange-50"
                      aria-label={`Avançar ${section.title}`}
                    >
                      →
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <div
                    ref={(node) => {
                      sectionRefs.current[section.id] = node;
                    }}
                    className="
                      no-scrollbar flex gap-6 overflow-x-auto pb-4
                      snap-x snap-mandatory scroll-smooth
                    "
                  >
                    {section.items.map((item) => (
                      <article
                        key={`${section.id}-${item.title}`}
                        data-card
                        className="
                          snap-start
                          w-[78%] sm:w-[360px] lg:w-[calc((100%-48px)/3)]
                          shrink-0
                          overflow-hidden rounded-3xl
                          border border-orange-200/60 bg-white/70
                          shadow-[0_18px_50px_-28px_rgba(255,115,22,0.45)]
                          backdrop-blur
                        "
                      >
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.alt}
                            className="h-full w-full object-cover object-[center_38%] transition duration-500 hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(255,255,255,0.88),transparent_40%)]" />
                        </div>

                        <div className="p-6">
                          <h4 className="text-lg font-semibold text-orange-950">{item.title}</h4>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="contato" className="border-t border-orange-200/60 bg-white/70">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <h2 className="text-3xl font-semibold text-orange-950">Contato</h2>
                <p className="mt-3 text-orange-900/70">Coloca aqui endereço e referências.</p>

                <div className="mt-6 space-y-3 text-orange-900/80">
                  <p>
                    Endereço: <span className="text-orange-800/70">R. Wâlter ...</span>
                  </p>
                  <p>
                    Horário: <span className="text-orange-800/70">Todos os dias</span>
                  </p>
                  <p>
                    WhatsApp: <span className="text-orange-800/70">+55 ...</span>
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-orange-200/60 bg-white/80 p-6 shadow-[0_18px_50px_-28px_rgba(255,115,22,0.35)]">
                <p className="text-sm uppercase tracking-[0.25em] text-orange-600">Pedidos</p>
                <h3 className="mt-2 text-xl font-semibold text-orange-950">Faça seu pedido rápido</h3>
                <p className="mt-2 text-sm text-orange-900/70">Clique abaixo e fale direto no WhatsApp.</p>

                <a
                  href={whatsAppHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 shadow-lg shadow-orange-200/60"
                >
                  Abrir WhatsApp
                </a>

                <p className="mt-3 text-xs text-orange-900/60">Dica: depois podemos adicionar mensagem automática.</p>
              </div>
            </div>

            <div className="mt-12 flex flex-col items-center gap-3">
              <img
                src="/images/minicoxinhaslogo.png"
                alt="Logo Mini Coxinhas"
                className="h-14 w-14 rounded-xl bg-white p-1 object-contain ring-1 ring-orange-200"
              />
              <p className="text-sm font-semibold text-orange-950">Mini Coxinhas</p>
            </div>

            <p className="mt-4 text-center text-xs text-orange-900/50">
              © {year} Mini Coxinhas. Todos os direitos reservados.
            </p>
          </div>
        </section>
      </main>

      <a
        href={whatsAppHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Chamar no WhatsApp"
        className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_18px_36px_-18px_rgba(37,211,102,0.95)] transition hover:scale-105 hover:bg-[#20bf5b]"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-current">
          <path d="M19.05 4.94A9.86 9.86 0 0 0 12 2a10 10 0 0 0-8.67 14.97L2 22l5.18-1.3A10 10 0 1 0 19.05 4.94ZM12 20a7.93 7.93 0 0 1-4.04-1.1l-.29-.17-3.07.77.82-2.99-.19-.31A8 8 0 1 1 12 20Zm4.4-5.95c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12s-.62.78-.76.94c-.14.16-.28.18-.52.06a6.43 6.43 0 0 1-1.9-1.17 7.12 7.12 0 0 1-1.3-1.62c-.14-.24-.01-.36.1-.48.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.4h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.58 4.12 3.62.58.25 1.03.4 1.38.52.58.19 1.1.16 1.52.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
        </svg>
      </a>
    </>
  );
}

export default App;
