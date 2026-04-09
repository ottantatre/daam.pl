import { HamburgerMenu } from "./HamburgerMenu";

export function Header() {
  return (
    <header className="fixed bg-zinc-50 top-0 left-0 right-0 z-50 flex items-center px-4 gap-4 h-12">
      <HamburgerMenu />
    </header>
  );
}
