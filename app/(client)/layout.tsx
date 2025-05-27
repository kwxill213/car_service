import Footer from "@/components/client/Footer";
import Header from "@/components/client/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <div className="min-h-screen flex flex-col">
          <Header />
        <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
          <Footer />
        </div>
  );
}