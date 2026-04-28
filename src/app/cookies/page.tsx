import { NavDestinationShell } from '@/components/nav-destination-shell';
import { TopNav } from '@/components/top-nav';
import { getLanguage } from '@/lib/i18n';

type Props = { searchParams: { lang?: string } };

const copy = {
  es: {
    title: 'Cookies',
    blocks: [
      {
        type: 'paragraph' as const,
        text: 'VYM puede utilizar cookies técnicas y de analítica para garantizar el funcionamiento del sitio y entender el uso agregado de la herramienta.',
      },
      {
        type: 'paragraph' as const,
        text: 'La configuración detallada de cookies se ofrecerá al usuario conforme evolucione la versión pública del producto.',
      },
    ],
  },
  en: {
    title: 'Cookies',
    blocks: [
      {
        type: 'paragraph' as const,
        text: 'VYM may use technical and analytics cookies to ensure the proper functioning of the site and understand aggregated usage of the tool.',
      },
      {
        type: 'paragraph' as const,
        text: 'A more detailed cookie configuration will be offered to users as the public version of the product evolves.',
      },
    ],
  },
};

export default function CookiesPage({ searchParams }: Props) {
  const lang = getLanguage(searchParams.lang);

  return (
    <>
      <TopNav currentPath="/cookies" lang={lang} />
      <NavDestinationShell blocks={copy[lang].blocks} lang={lang} title={copy[lang].title} />
    </>
  );
}
