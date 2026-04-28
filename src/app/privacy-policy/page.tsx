import { NavDestinationShell } from '@/components/nav-destination-shell';
import { TopNav } from '@/components/top-nav';
import { getLanguage } from '@/lib/i18n';

type Props = { searchParams: { lang?: string } };

const copy = {
  es: {
    title: 'Política de privacidad',
    blocks: [
      {
        type: 'paragraph' as const,
        text: 'Tratamos la información introducida por el usuario con la finalidad de prestar el servicio, mejorar la herramienta y, en su caso, atender solicitudes de contacto o de servicios adicionales.',
      },
      {
        type: 'paragraph' as const,
        text: 'No compartiremos información identificable con terceros salvo obligación legal o consentimiento del usuario.',
      },
    ],
  },
  en: {
    title: 'Privacy Policy',
    blocks: [
      {
        type: 'paragraph' as const,
        text: 'We process the information entered by the user for the purpose of delivering the service, improving the tool, and, where applicable, responding to contact requests or additional service requests.',
      },
      {
        type: 'paragraph' as const,
        text: 'We do not share identifiable information with third parties unless required by law or expressly authorized by the user.',
      },
    ],
  },
};

export default function PrivacyPolicyPage({ searchParams }: Props) {
  const lang = getLanguage(searchParams.lang);

  return (
    <>
      <TopNav currentPath="/privacy-policy" lang={lang} />
      <NavDestinationShell blocks={copy[lang].blocks} lang={lang} title={copy[lang].title} />
    </>
  );
}
