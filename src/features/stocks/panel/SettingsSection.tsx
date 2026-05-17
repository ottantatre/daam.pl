export function SettingsSection() {
  return (
    <div className="flex flex-col gap-2 min-w-30 text-extrasmall text-zinc-500">
      <div className="flex flex-col gap-1">
        <span className="uppercase tracking-widest text-zinc-400">notyfikacje</span>
        <span className="text-zinc-500">— wkrótce</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="uppercase tracking-widest text-zinc-400">strategia</span>
        <span className="text-zinc-500">1% rolling</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="uppercase tracking-widest text-zinc-400">xtb</span>
        <span className="text-zinc-500">brak konta</span>
      </div>
    </div>
  );
}
