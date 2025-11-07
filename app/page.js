"use client"
import { useEffect } from 'react'
import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import { getAllNFTs } from './NFTServices';


import Hero from "./components/Hero";
import Artwork from "./components/Artwork";
import CreateNFT from "./components/CreateNFT";
import Loading from "./components/Loading";
import Transactions from "./components/Transactions";

import Footer from "./components/Footer";

export default function Home() {

  const { address, caipAddress, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");

 

  useEffect(async () => {
    async function loadData() {

      const data = await getAllNFTs(walletProvider);
      console.log('data:',data);
    }

    loadData();
    
  }, [walletProvider])

  return (
    <div className="min-h-screen">
    <div className="gradient-bg-hero">


      <Hero />
    </div>
    <Artwork />
    <Loading />
    <Transactions />
    <CreateNFT />
    <Footer />
  </div>

  );
}