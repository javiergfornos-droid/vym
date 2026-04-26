import { ReactNode } from 'react';

type Props = {
  id?: string;
  title: string;
  eyebrow: string;
  children: ReactNode;
};

export function SectionShell({ id, title, eyebrow, children }: Props) {
  return (
    <section id={id} className="border-b border-line py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[260px_1fr]">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-mutedInk">{eyebrow}</p>
          <h2 className="font-editorial text-3xl text-slateInk">{title}</h2>
        </div>
        <div className="rounded-2xl border border-line bg-white p-8 shadow-whisper">{children}</div>
      </div>
    </section>
  );
}
