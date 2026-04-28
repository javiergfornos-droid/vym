import { SiteFooter } from './site-footer';

import { type Language } from '@/lib/i18n';

type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'numbered'; items: Array<{ title: string; text: string }> };

type Props = {
  lang: Language;
  title: string;
  blocks: ContentBlock[];
};

export function NavDestinationShell({ lang, title, blocks }: Props) {
  return (
    <main className="bg-ivory pt-20">
      <section className="border-b border-line py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="font-editorial text-4xl tracking-premium text-slateInk md:text-5xl">{title}</h1>
          <div className="mt-8 space-y-6 font-editorial text-lg leading-relaxed text-mutedInk">
            {blocks.map((block, index) => {
              if (block.type === 'paragraph') {
                return <p key={`${block.type}-${index}`}>{block.text}</p>;
              }

              if (block.type === 'list') {
                return (
                  <ul key={`${block.type}-${index}`} className="list-disc space-y-2 pl-6">
                    {block.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                );
              }

              return (
                <ol key={`${block.type}-${index}`} className="space-y-5">
                  {block.items.map((item) => (
                    <li key={item.title}>
                      <p className="font-editorial text-xl leading-relaxed text-slateInk">{item.title}</p>
                      <p className="mt-2">{item.text}</p>
                    </li>
                  ))}
                </ol>
              );
            })}
          </div>
        </div>
      </section>
      <SiteFooter lang={lang} />
    </main>
  );
}
