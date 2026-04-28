import Link from 'next/link';

import { TopNav } from '@/components/top-nav';
import { getLanguage, type Language } from '@/lib/i18n';

type Props = {
  searchParams: { lang?: string };
};

type LandingCopy = {
  hero: {
    eyebrow: string;
    headline: string;
    body: string;
    primaryCta: string;
    secondaryCta: string;
  };
  usage: {
    sectionTitle: string;
    cards: Array<{ title: string; body: string }>;
  };
  footerLinks: string[];
};

const landingCopy: Record<Language, LandingCopy> = {
  es: {
    hero: {
      eyebrow: 'PLATAFORMA PREMIUM DE VALORACIÓN',
      headline: 'Haz tu propio modelo y valora tu empresa.',
      body: 'Introduce tu información financiera, proyecta tus hipótesis con referencias sectoriales y entiende cómo cada decisión afecta al valor.',
      primaryCta: 'Valora tu empresa',
      secondaryCta: 'Cómo funciona',
    },
    usage: {
      sectionTitle: 'Hazlo tú mismo. Paso a paso.',
      cards: [
        {
          title: 'Introduce tu información financiera',
          body: 'Completa una base mínima de cuenta de resultados y balance para construir una primera valoración.',
        },
        {
          title: 'Proyecta tus hipótesis con claridad y referencias sectoriales',
          body: 'Define el crecimiento, márgenes, inversión y capital circulante con una guía estructurada y comparativas sectoriales.',
        },
        {
          title: 'Entiende cómo cada decisión afecta al valor',
          body: 'Visualiza el impacto de tus hipótesis sobre el enterprise value, equity value y el rango de valoración.',
        },
      ],
    },
    footerLinks: ['Disclaimer', 'Política de privacidad', 'Cookies', 'Términos de uso', 'Contacto'],
  },
  en: {
    hero: {
      eyebrow: 'PREMIUM VALUATION PLATFORM',
      headline: 'Build your own model to value your company.',
      body: 'Enter your financial information, project your assumptions with sector references, and understand how each decision affects value.',
      primaryCta: 'Value your company',
      secondaryCta: 'How it works',
    },
    usage: {
      sectionTitle: 'Do it yourself. Step by step.',
      cards: [
        {
          title: 'Enter your financial information',
          body: 'Complete a minimal income statement and balance sheet to build an initial valuation.',
        },
        {
          title: 'Project your assumptions clearly with sector references',
          body: 'Define growth, margins, investment and working capital with structured guidance and sector benchmarks.',
        },
        {
          title: 'Understand how each decision affects value',
          body: 'Visualize how your assumptions affect enterprise value, equity value and the valuation range.',
        },
      ],
    },
    footerLinks: ['Disclaimer', 'Privacy Policy', 'Cookies', 'Terms of Use', 'Contact'],
  },
};

const withLang = (path: string, lang: Language) => `${path}?lang=${lang}`;

export default function Home({ searchParams }: Props) {
  const lang = getLanguage(searchParams.lang);
  const copy = landingCopy[lang];

  return (
    <>
      <TopNav currentPath="/" lang={lang} />
      <main className="bg-ivory pt-20">
        <section className="border-b border-line">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 pb-14 pt-16">
            <div>
              <p className="mb-5 text-xs uppercase tracking-[0.2em] text-mutedInk">{copy.hero.eyebrow}</p>
              <h1 className="max-w-4xl font-editorial text-5xl leading-[1.08] tracking-premium text-slateInk md:text-6xl lg:text-7xl">
                {copy.hero.headline}
              </h1>
              <p className="mt-7 max-w-2xl font-editorial text-lg leading-relaxed text-mutedInk">{copy.hero.body}</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  className="rounded-full bg-accent px-7 py-3 text-xs uppercase tracking-[0.15em] text-ivory transition hover:bg-slateInk"
                  href={withLang('/wizard/intro', lang)}
                >
                  {copy.hero.primaryCta}
                </Link>
                <Link
                  className="rounded-full border border-line bg-white px-7 py-3 text-xs uppercase tracking-[0.15em] text-slateInk hover:border-mutedInk"
                  href={withLang('/how-it-works', lang)}
                >
                  {copy.hero.secondaryCta}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div id="what-we-do" className="scroll-mt-28" />
        <section id="how-it-works" className="border-b border-line py-16 scroll-mt-28">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-editorial text-4xl tracking-premium text-slateInk md:text-5xl">{copy.usage.sectionTitle}</h2>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {copy.usage.cards.map((card) => (
                <article key={card.title} className="rounded-2xl border border-line bg-white p-7 shadow-whisper">
                  <h3 className="font-editorial text-2xl leading-snug text-slateInk">{card.title}</h3>
                  <p className="mt-4 font-editorial text-base leading-relaxed text-mutedInk">{card.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="who-we-are" className="border-b border-line py-12 scroll-mt-28">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-sm uppercase tracking-[0.16em] text-mutedInk">
              {lang === 'es'
                ? 'Pendiente de aprobación de contenido para esta sección.'
                : 'Content pending explicit approval for this section.'}
            </p>
          </div>
        </section>

        <footer id="contact" className="mx-auto max-w-6xl px-6 py-10">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 font-editorial text-sm text-mutedInk">
            {copy.footerLinks.map((item) => (
              <li key={item}>
                <a className="hover:text-slateInk" href="#">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </footer>
      </main>
    </>
  );
}
