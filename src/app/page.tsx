import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main>
        <Image
          src="assets/logo.svg"
          alt="Vercel Logo"
          width={64}
          height={64}
          className="invert"
          loading="eager"
        />
      </main>
    </div>
  );
}
