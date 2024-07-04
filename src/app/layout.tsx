import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuranHub | Your essential online Quran companion",
  description:
    "Quran Hub is your essential online Quran companion, providing access to the holy text anytime, anywhere. With Quran Hub, users can seamlessly navigate through the verses of the Quran, offering a digital platform that ensures accessibility and convenience.",
  icons: [{ rel: "shortcut icon", url: "/logo.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
