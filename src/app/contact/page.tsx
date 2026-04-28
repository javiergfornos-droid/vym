import { NavDestinationShell } from '@/components/nav-destination-shell';
import { TopNav } from '@/components/top-nav';
import { getLanguage } from '@/lib/i18n';

type Props = { searchParams: { lang?: string } };

const copy = {
  es: {
    title: 'Contacto',
    blocks: [
      {
        type: 'paragraph' as const,
        text: 'Si quieres profundizar en una valoración, revisar hipótesis concretas o solicitar un entregable más completo, puedes ponerte en contacto con nosotros.',
      },
      { type: 'paragraph' as const, text: 'Opciones de contacto' },
      {
        type: 'list' as const,
        items: [
          'Solicitar una reunión',
          'Pedir un informe ampliado',
          'Resolver dudas sobre el modelo',
          'Explorar un mandato más detallado de modelización o valoración',
        ],
      },
      { type: 'paragraph' as const, text: 'Email' },
      { type: 'paragraph' as const, text: '[Tu email]' },
      { type: 'paragraph' as const, text: 'LinkedIn' },
      { type: 'paragraph' as const, text: '[Tu LinkedIn]' },
    ],
  },
  en: {
    title: 'Contact',
    blocks: [
      {
        type: 'paragraph' as const,
        text: 'If you want to go deeper into a valuation, review specific assumptions, or request a more complete deliverable, you can get in touch with us.',
      },
      { type: 'paragraph' as const, text: 'Contact options' },
      {
        type: 'list' as const,
        items: [
          'Request a meeting',
          'Ask for an extended report',
          'Resolve questions about the model',
          'Explore a more detailed valuation or modelling engagement',
        ],
      },
      { type: 'paragraph' as const, text: 'Email' },
      { type: 'paragraph' as const, text: '[Your email]' },
      { type: 'paragraph' as const, text: 'LinkedIn' },
      { type: 'paragraph' as const, text: '[Your LinkedIn]' },
    ],
  },
};

export default function ContactPage({ searchParams }: Props) {
  const lang = getLanguage(searchParams.lang);

  return (
    <>
      <TopNav currentPath="/contact" lang={lang} />
      <NavDestinationShell blocks={copy[lang].blocks} lang={lang} title={copy[lang].title} />
    </>
  );
}
