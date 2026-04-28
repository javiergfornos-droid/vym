import { NavDestinationShell } from '@/components/nav-destination-shell';
import { TopNav } from '@/components/top-nav';
import { getLanguage } from '@/lib/i18n';

type Props = { searchParams: { lang?: string } };

const copy = {
  es: {
    title: 'Qué hacemos',
    blocks: [
      { type: 'paragraph' as const, text: 'VYM es una herramienta de modelización y valoración diseñada para ayudar a propietarios, directivos e inversores a construir una primera lógica de valoración con rigor financiero.' },
      { type: 'paragraph' as const, text: 'Nuestra propuesta combina tres elementos:' },
      {
        type: 'numbered' as const,
        items: [
          {
            title: 'Modelización guiada',
            text: 'Estructuramos las hipótesis clave del modelo financiero para que el usuario pueda introducirlas de manera ordenada y comprensible.',
          },
          {
            title: 'Contexto sectorial',
            text: 'Mostramos referencias agregadas del sector cuando son útiles para contrastar hipótesis y entender mejor su razonabilidad.',
          },
          {
            title: 'Entregables escalables',
            text: 'Desde una primera salida visual hasta informes más desarrollados, VYM está pensado para adaptarse al nivel de profundidad que requiera cada caso.',
          },
        ],
      },
      { type: 'paragraph' as const, text: 'No somos una calculadora genérica.' },
      { type: 'paragraph' as const, text: 'VYM está concebido para ayudarte a construir tu propio modelo y comprender cómo cada hipótesis afecta al valor.' },
    ],
  },
  en: {
    title: 'What we do',
    blocks: [
      { type: 'paragraph' as const, text: 'VYM is a modelling and valuation tool designed to help owners, executives, and investors build an initial valuation logic with financial rigor.' },
      { type: 'paragraph' as const, text: 'Our approach combines three elements:' },
      {
        type: 'numbered' as const,
        items: [
          {
            title: 'Guided modelling',
            text: 'We structure the key assumptions of the financial model so the user can enter them in an orderly and understandable way.',
          },
          {
            title: 'Sector context',
            text: 'We provide aggregated sector references whenever they are useful to test assumptions and better understand their reasonableness.',
          },
          {
            title: 'Scalable deliverables',
            text: 'From an initial visual output to more developed reports, VYM is designed to adapt to the level of depth each case requires.',
          },
        ],
      },
      { type: 'paragraph' as const, text: 'We are not a generic calculator.' },
      { type: 'paragraph' as const, text: 'VYM is built to help you construct your own model and understand how each assumption affects value.' },
    ],
  },
};

export default function WhatWeDoPage({ searchParams }: Props) {
  const lang = getLanguage(searchParams.lang);

  return (
    <>
      <TopNav currentPath="/what-we-do" lang={lang} />
      <NavDestinationShell blocks={copy[lang].blocks} lang={lang} title={copy[lang].title} />
    </>
  );
}
