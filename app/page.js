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
import Alert from "./components/Alert";
import ShowNFT from './components/ShowNFT';
import UpdateNFT from './components/UpdateNFT';




export default function Home() {
  const { address, caipAddress, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");
  
  async function loadData() {
    try {
      const data = await getAllNFTs({ walletProvider, address});
      
    } catch (err) {
      console.error('Error fetching NFTs:', err);
    }
  }
  loadData();

  return (
    <div className="min-h-screen">
      <div className="gradient-bg-hero">


        <Hero />
      </div>
      <Artwork />
      <Loading />
      <ShowNFT />

      <Transactions />
      <CreateNFT />
      
      
      <Alert />
      <UpdateNFT />
    </div>

  );
}