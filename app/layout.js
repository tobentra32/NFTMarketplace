import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ContextProvider from './context'
import Header from "./components/Header"
import Footer from "./components/Footer"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NFT Marketplace",
  description: "A Marketplace to Buy and Sell Digital Arts, NFTs Collections",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex flex-col min-h-screen bg-black">

          <ContextProvider>
            <Header />

            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </ContextProvider>

        </div>

      </body>
    </html>
  );
}