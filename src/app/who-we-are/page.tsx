import { NavDestinationShell } from '@/components/nav-destination-shell';
import { TopNav } from '@/components/top-nav';
import { getLanguage } from '@/lib/i18n';

type Props = { searchParams: { lang?: string } };

const copy = {
  es: {
    title: 'Quiénes somos',
    blocks: [
      {
        type: 'paragraph' as const,
        text: 'VYM está impulsado por Javier González Fornos, profesional senior de finanzas corporativas y asesoramiento estratégico, con 15 años de experiencia liderando todo el ciclo de inversión, desde la originación propietaria hasta la salida, con foco en activos industriales e infraestructuras, y actualmente actuando como Interim CFO para clientes industriales.',
      },
      { type: 'paragraph' as const, text: 'Javier compagina esa experiencia profesional con actividad académica como:' },
      {
        type: 'list' as const,
        items: [
          'Associate Professor de Financial Modeling & Project Finance en IEB Madrid',
          'Associate Professor de Valuation en la Universidad Complutense',
        ],
      },
      {
        type: 'paragraph' as const,
        text: 'Javier es Licenciado en Economía y Licenciado en Administración y Dirección de Empresas por la Universidad de Oviedo, posee un Executive Master in Finance por IE Business School y un Executive MBA por la ESCP Business School.',
      },
      {
        type: 'paragraph' as const,
        text: 'Posee, además, la Certificación CEVE (Certificado de Experto en Valoración de Empresas) y la Certificación CERRE (Certificado de Experto en Restructuraciones y Refinanciaciones Empresariales), por el Instituto Español de Analistas Financieros (IEAF).',
      },
      { type: 'paragraph' as const, text: 'VYM nace de una idea simple: hacer más accesible una valoración financiera seria, sin vaciarla de criterio técnico.' },
    ],
  },
  en: {
    title: 'Who we are',
    blocks: [
      {
        type: 'paragraph' as const,
        text: 'VYM is led by Javier González Fornos, senior finance and strategic advisory executive with 15 years of experience across the full investment lifecycle, from proprietary origination to exit, with a focus on industrial assets and infrastructure, and currently acting as Interim CFO for industrial clients.',
      },
      { type: 'paragraph' as const, text: 'This professional experience is complemented by his academic work as:' },
      {
        type: 'list' as const,
        items: [
          'Associate Professor of Financial Modeling & Project Finance at IEB Madrid',
          'Associate Professor of Valuation at Universidad Complutense',
        ],
      },
      {
        type: 'paragraph' as const,
        text: 'Javier holds Degrees in Economics and Business Administration from the University of Oviedo, as well as a MSc in Finance from IE Business School and an Executive MBA from ESCP Business School. Javier is a charterholder of Corporate Valuation & Refinancing Certificates at IEAF.',
      },
      { type: 'paragraph' as const, text: 'VYM was built around a simple idea: making financial valuation more accessible without stripping it of technical judgment.' },
    ],
  },
};

export default function WhoWeArePage({ searchParams }: Props) {
  const lang = getLanguage(searchParams.lang);

  return (
    <>
      <TopNav currentPath="/who-we-are" lang={lang} />
      <NavDestinationShell blocks={copy[lang].blocks} lang={lang} title={copy[lang].title} />
    </>
  );
}
