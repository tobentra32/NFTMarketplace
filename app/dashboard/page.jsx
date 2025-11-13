"use client";

import { useEffect, useState } from 'react'
import { FaTimes } from "react-icons/fa";
import { setGlobalState, useGlobalState } from '../store'
import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";
import { getMyListedNFTs } from '../NFTServices';
import { BrowserProvider, Contract, formatUnits, ethers, parseEther } from "ethers";
import { useRouter } from 'next/navigation'
import ShowListed from '../components/ShowListed';


export default function MyListedAssets() {
  const [loadingState, setLoadingState] = useState('not-loaded')
  const { address, caipAddress, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider('eip155')
  const router = useRouter();

  const [listedNfts] = useGlobalState('listedNfts')
  const [end, setEnd] = useState(4)
  const [count] = useState(4)
  const [collection, setCollection] = useState([])

  const getCollection = () => {
    return listedNfts.slice(0, end)
  }

  useEffect(() => {
    setCollection(getCollection())
  }, [listedNfts, end])
  
  
  async function loadNFTs() {
    //if (!isConnected) throw Error("User disconnected");

    try {
      const data = await getMyListedNFTs({ walletProvider });
      console.log('data:', data);
    } catch (err) {
      console.error('Error fetching NFTs:', err);
    }
  }

  
  loadNFTs();

  
  if (loadingState === 'loaded' && !listedNfts.length) return (<h1 className="py-10 px-20 text-3xl">No NFTs owned</h1>)
  return (
    <div className="bg-[#151c25] gradient-bg-artworks">
      <ShowListed />
      <div className="w-4/5 py-10 mx-auto">
        <h4 className="text-white text-3xl font-bold uppercase text-gradient">
          {collection.length > 0 ? 'Latest Artworks' : 'No Artworks Yet'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-4 lg:gap-3 py-2.5">
          {collection.map((nft, i) => (
            <Card key={i} nft={nft} />
          ))}
        </div>

        {collection.length > 0 && listedNfts.length > collection.length ? (
          <div className="text-center my-5">
            <button
              className="shadow-xl shadow-black text-white
            bg-[#e32970] hover:bg-[#bd255f]
            rounded-full cursor-pointer p-2"
              onClick={() => setEnd(end + count)}
            >
              Load More
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )


}

const Card = ({ nft }) => {
  const setNFT = () => {
    setGlobalState('nft', nft)
    setGlobalState('listModal', 'scale-100')
  }

  return (
    <div className="w-full shadow-xl shadow-black rounded-md overflow-hidden bg-gray-800 my-2 p-3">
      <img
        src={nft.tokenURI}
        alt={nft.title}
        className="h-60 w-full object-cover shadow-lg shadow-black rounded-lg mb-3"
      />
      <h4 className="text-white font-semibold">{nft.title}</h4>
      <p className="text-gray-400 text-xs my-1">{nft.description}</p>
      <div className="flex justify-between items-center mt-3 text-white">
        <div className="flex flex-col">
          <small className="text-xs">Current Price</small>
          <p className="text-sm font-semibold">{formatUnits(nft.price)} ETH</p>
        </div>

        <button
          className="shadow-lg shadow-black text-white text-sm bg-[#e32970]
            hover:bg-[#bd255f] cursor-pointer rounded-full px-1.5 py-1"
          onClick={setNFT}
        >
          View Details
        </button>
      </div>
    </div>
  )
}