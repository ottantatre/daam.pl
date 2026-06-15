import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { isLocale, locales } from "@/lib/i18n";
import { getDictionary } from "./dictionaries";
import "../globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "daam.pl",
  description: "daam.pl",
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const year = new Date().getFullYear();

  return (
    <html lang={lang} className={`${ibmPlexMono.variable} h-full antialiased`}>
      <body className="flex min-h-dvh flex-col bg-black font-mono text-zinc-300">
        <Header lang={lang} nav={dict.nav} />
        <main className="flex flex-1 flex-col items-center justify-center px-6 py-10">
          {children}
        </main>
        <Footer lang={lang} privacy={dict.footer.privacy} year={year} />
      </body>
    </html>
  );
}
