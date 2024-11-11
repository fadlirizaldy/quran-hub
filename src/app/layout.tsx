import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { Suspense } from "react";
import "./globals.css";
import { DataProvider } from "@/context/DataArchivedContext";
import "react-toastify/dist/ReactToastify.css";
import LoadingLayout from "./loading";

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
      <body className={inter.className}>
        <DataProvider>
          <ToastContainer />
          <Suspense fallback={<LoadingLayout />}>{children}</Suspense>
        </DataProvider>
      </body>
    </html>
  );
}
