"use client";

import { useState } from "react";
import { useGlobalState } from "../store";
import { ConnectButton } from "./connectButton";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  const [connectedAccount] = useGlobalState("connectedAccount");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-11/12 mx-auto py-4 flex items-center justify-between relative">
      {/* Logo */}
      <div className="flex items-center">
        <Image
          className="cursor-pointer"
          src="/nftlogo.jpg"
          alt="NFTMarketplace"
          width={50}
          height={50}
          priority
        />
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex items-center gap-6 text-white">
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link href="/myNFT">MyNFTs</Link>
        </li>
        <li>Community</li>
      </ul>

      {/* Desktop Connect Button */}
      <div className="hidden md:block">
        <ConnectButton />
      </div>

      {/* Hamburger Button - Mobile */}
      <button
        onClick={() => setMenuOpen(true)}
        className="md:hidden text-white text-3xl"
      >
        ☰
      </button>

      {/* ===== Slide-In Sidebar (Right) ===== */}
      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 right-0 h-full w-64 bg-gray-900 text-white z-50 shadow-xl
          transform transition-transform duration-300 ease-in-out
          ${menuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Close Button */}
        <button
          onClick={() => setMenuOpen(false)}
          className="text-white text-3xl absolute top-4 right-4"
        >
          ×
        </button>

        <ul className="mt-20 flex flex-col gap-6 px-6 text-lg">
          <li onClick={() => setMenuOpen(false)}>
            <Link href="/dashboard">Dashboard</Link>
          </li>

          <li onClick={() => setMenuOpen(false)}>
            <Link href="/myNFT">MyNFTs</Link>
          </li>

          <li onClick={() => setMenuOpen(false)}>Community</li>
        </ul>
        <div className="pr-6 mt-4 mr-10 text-[10px] scale-90">
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
};

export default Header;
