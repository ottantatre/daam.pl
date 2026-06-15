import Image from "next/image";

// Home — the large logo lives here as the hero; the header keeps a small 32×32 mark.
export default function Home() {
  return (
    <Image
      src="/logo_white_transparent.svg"
      alt="daam.pl"
      width={96}
      height={96}
      priority
    />
  );
}
