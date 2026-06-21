import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WAButton from "@/components/layout/WAButton";
import ScrollReveal from "@/components/layout/ScrollReveal";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WAButton />
      <ScrollReveal />
    </div>
  );
}
