import Link from 'next/link';

import { type Language } from '@/lib/i18n';

type FooterLink = {
  href: string;
  label: string;
};

type Props = {
  lang: Language;
};

const withLang = (path: string, lang: Language) => `${path}?lang=${lang}`;

const footerLinks: Record<Language, FooterLink[]> = {
  es: [
    { href: '/disclaimer', label: 'Disclaimer' },
    { href: '/privacy-policy', label: 'Política de privacidad' },
    { href: '/cookies', label: 'Cookies' },
    { href: '/terms-of-use', label: 'Términos de uso' },
    { href: '/contact', label: 'Contacto' },
  ],
  en: [
    { href: '/disclaimer', label: 'Disclaimer' },
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/cookies', label: 'Cookies' },
    { href: '/terms-of-use', label: 'Terms of Use' },
    { href: '/contact', label: 'Contact' },
  ],
};

export function SiteFooter({ lang }: Props) {
  return (
    <footer className="mx-auto max-w-6xl px-6 py-10">
      <ul className="flex flex-wrap gap-x-8 gap-y-3 font-editorial text-sm text-mutedInk">
        {footerLinks[lang].map((item) => (
          <li key={item.href}>
            <Link className="hover:text-slateInk" href={withLang(item.href, lang)}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </footer>
  );
}
