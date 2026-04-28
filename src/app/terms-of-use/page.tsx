import { NavDestinationShell } from '@/components/nav-destination-shell';
import { TopNav } from '@/components/top-nav';
import { getLanguage } from '@/lib/i18n';

type Props = { searchParams: { lang?: string } };

const copy = {
  es: {
    title: 'Términos de uso',
    blocks: [
      {
        type: 'paragraph' as const,
        text: 'El uso de VYM implica la aceptación de estos términos.',
      },
      {
        type: 'paragraph' as const,
        text: 'El usuario es responsable de la calidad, integridad y legitimidad de la información que introduzca en la herramienta.',
      },
      {
        type: 'paragraph' as const,
        text: 'VYM se ofrece como herramienta de apoyo analítico y no garantiza que los resultados sean aptos para usos legales, regulatorios o transaccionales sin revisión profesional adicional.',
      },
    ],
  },
  en: {
    title: 'Terms of Use',
    blocks: [
      {
        type: 'paragraph' as const,
        text: 'By using VYM, the user accepts these terms.',
      },
      {
        type: 'paragraph' as const,
        text: 'The user is responsible for the quality, integrity, and legitimacy of the information entered into the tool.',
      },
      {
        type: 'paragraph' as const,
        text: 'VYM is provided as an analytical support tool and does not guarantee that its outputs are suitable for legal, regulatory, or transactional purposes without additional professional review.',
      },
    ],
  },
};

export default function TermsOfUsePage({ searchParams }: Props) {
  const lang = getLanguage(searchParams.lang);

  return (
    <>
      <TopNav currentPath="/terms-of-use" lang={lang} />
      <NavDestinationShell blocks={copy[lang].blocks} lang={lang} title={copy[lang].title} />
    </>
  );
}
