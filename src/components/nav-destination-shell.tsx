import { type Language } from '@/lib/i18n';

type Props = {
  lang: Language;
  title: string;
};

export function NavDestinationShell({ lang, title }: Props) {
  return (
    <main className="bg-ivory pt-20">
      <section className="border-b border-line py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="font-editorial text-4xl tracking-premium text-slateInk md:text-5xl">{title}</h1>
          <p className="mt-6 text-sm uppercase tracking-[0.16em] text-mutedInk">
            {lang === 'es'
              ? 'Pendiente de aprobación de contenido para esta página.'
              : 'Content pending explicit approval for this page.'}
          </p>
        </div>
      </section>
    </main>
  );
}
