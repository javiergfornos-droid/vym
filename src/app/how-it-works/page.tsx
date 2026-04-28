import { NavDestinationShell } from '@/components/nav-destination-shell';
import { TopNav } from '@/components/top-nav';
import { getLanguage } from '@/lib/i18n';

type Props = { searchParams: { lang?: string } };

const copy = {
  es: {
    title: 'Cómo funciona',
    blocks: [
      { type: 'paragraph' as const, text: 'VYM te ayuda a construir una primera valoración financiera de tu empresa de forma guiada, clara y estructurada.' },
      { type: 'paragraph' as const, text: 'El proceso se divide en cuatro pasos:' },
      {
        type: 'numbered' as const,
        items: [
          {
            title: '1. Introduce tu información financiera',
            text: 'Partimos de una base mínima de cuenta de resultados y balance para construir el punto de partida del modelo.',
          },
          {
            title: '2. Define tus hipótesis',
            text: 'Puedes proyectar ingresos, costes, inversiones y otras variables clave mediante un flujo guiado o mediante un fast-track más rápido.',
          },
          {
            title: '3. Contrasta con referencias sectoriales',
            text: 'Cuando existan comparables suficientes, VYM te muestra benchmarks agregados para ayudarte a contextualizar tus hipótesis sin quitarte el control.',
          },
          {
            title: '4. Obtén una primera valoración',
            text: 'El sistema genera una primera aproximación al valor de tu empresa y te permite profundizar posteriormente con entregables más completos.',
          },
        ],
      },
      { type: 'paragraph' as const, text: 'VYM no pretende sustituir el criterio profesional: pretende estructurarlo, hacerlo visible y ponerlo en tus manos.' },
    ],
  },
  en: {
    title: 'How it works',
    blocks: [
      { type: 'paragraph' as const, text: 'VYM helps you build an initial financial valuation of your company in a guided, clear, and structured way.' },
      { type: 'paragraph' as const, text: 'The process is divided into four steps:' },
      {
        type: 'numbered' as const,
        items: [
          {
            title: '1. Enter your financial information',
            text: 'We start from a minimal income statement and balance sheet to establish the model’s baseline.',
          },
          {
            title: '2. Define your assumptions',
            text: 'You can project revenue, costs, investments, and other key variables through a guided flow or a faster fast-track mode.',
          },
          {
            title: '3. Compare against sector references',
            text: 'Whenever enough comparable companies exist, VYM shows aggregated benchmarks to help you contextualize your assumptions without taking control away from you.',
          },
          {
            title: '4. Obtain a first valuation',
            text: 'The system generates an initial estimate of your company’s value and allows you to go deeper afterwards through more complete deliverables.',
          },
        ],
      },
      { type: 'paragraph' as const, text: 'VYM is not meant to replace professional judgment. It is meant to structure it, make it visible, and put it in your hands.' },
    ],
  },
};

export default function HowItWorksPage({ searchParams }: Props) {
  const lang = getLanguage(searchParams.lang);

  return (
    <>
      <TopNav currentPath="/how-it-works" lang={lang} />
      <NavDestinationShell blocks={copy[lang].blocks} lang={lang} title={copy[lang].title} />
    </>
  );
}
