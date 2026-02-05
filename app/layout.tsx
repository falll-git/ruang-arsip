import "./globals.css";
import { Roboto } from "next/font/google";
import AppProviders from "@/components/providers/AppProviders";

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Ruwang Arsip - Sistem Manajemen Arsip Digital",
  description: "Sistem Manajemen Arsip Digital Terpadu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={roboto.className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
