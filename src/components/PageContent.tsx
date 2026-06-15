export function PageContent({ title, body }: { title: string; body: string }) {
  return (
    <article className="flex max-w-prose flex-col items-center gap-4 text-center">
      <h1 className="text-base font-medium uppercase tracking-[0.2em] text-zinc-100">
        {title}
      </h1>
      <p className="text-sm leading-relaxed text-zinc-400">{body}</p>
    </article>
  );
}
