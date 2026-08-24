import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WAButton from "@/components/layout/WAButton";
import BackToTop from "@/components/layout/BackToTop";
import ScrollReveal from "@/components/layout/ScrollReveal";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Skip link: tersembunyi sampai difokus lewat Tab, supaya pengguna
          keyboard/pembaca layar bisa melompati navbar langsung ke isi. */}
      <a
        href="#konten-utama"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-emerald-cta focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white focus:outline-none focus:ring-2 focus:ring-white"
      >
        Lompat ke konten utama
      </a>
      <Navbar />
      <main id="konten-utama" tabIndex={-1} className="flex-1">
        {children}
      </main>
      <Footer />
      <WAButton />
      <BackToTop />
      <ScrollReveal />
    </div>
  );
}
