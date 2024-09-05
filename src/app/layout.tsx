import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], 
  style: ["normal", "italic",], 
});

export const metadata: Metadata = {
  title: "Payompon Online",
  description: "Payompon online certification system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <main className="flex justify-center items-start bg-[#fbfaf7] h-screen overflow-auto">{children}</main>
      </body>
    </html>
  );
}
