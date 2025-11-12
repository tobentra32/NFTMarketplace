"use client";

import {
  useGlobalState,
  setGlobalState,
  truncate,
  setLoadingMsg,
  setAlert,
} from "../store";
import Identicon from 'react-identicons'
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { ethers } from "ethers";

import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";
import { BrowserProvider, Contract, formatUnits } from "ethers";

import { resellNFT } from "../NFTServices";

const ResellNft = () => {
  const [resellModal] = useGlobalState("resellModal");
  const [price, setPrice] = useState("");
  const [userNft] = useGlobalState("userNft");
  const [nft] = useGlobalState('nft')

  const { address, caipAddress, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");

  const nft_address = "0x70060798786f46af79392d71fa3197D052620892";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!price) return;

    setGlobalState("modal", "scale-0");
    //setGlobalState("loading", { show: true, msg: "Uploading IPFS data..." });

    try {
      

      setLoadingMsg("Intializing transaction...");

      const tokenId = userNft.id;

      await resellNFT(tokenId, price);

      //resetForm()
      setAlert("Listing completed...", "green");
      //window.location.reload()
    } catch (error) {
      console.log("Error uploading file: ", error);
      setAlert("Listing failed...", "red");
    }
  };

  

  const resetForm = () => {
    setTokenURI("");
    setImg("");
    setTitle("");
    setPrice("");
    setDescription("");
  };

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center
        justify-center bg-black bg-opacity-50 transform
        transition-transform duration-300 ${resellModal}`}
    >
      <div className="bg-[#151c25] shadow-xl shadow-[#e32970] rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <form className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold text-gray-400">List NFT</p>
            <button
              type="button"
              onClick={() => setGlobalState("resellModal", "scale-0")}
              className="border-0 bg-transparent focus:outline-none"
            >
              <FaTimes className="text-gray-400" />
            </button>
          </div>

          <div className="flex flex-row justify-center items-center rounded-xl mt-5">
            <div className="shrink-0 rounded-xl overflow-hidden h-40 w-40">
              <img
                className="h-full w-full object-cover cursor-pointer"
                src={userNft?.tokenURI}
                alt={userNft?.title}
              />
            </div>
          </div>

          <div className="flex flex-col justify-start rounded-xl mt-5">
            <h4 className="text-white font-semibold">{userNft?.title}</h4>
            <p className="text-gray-400 text-xs my-1">{userNft?.description}</p>

            <div className="flex justify-between items-center mt-3 text-white">
              <div className="flex justify-start items-center">
                <Identicon
                  string={userNft?.owner}
                  size={50}
                  className="h-10 w-10 object-contain rounded-full mr-3"
                />
                <div className="flex flex-col justify-center items-start">
                  <small className="text-white font-bold">@owner</small>
                  <small className="text-pink-800 font-semibold">
                    {userNft?.owner ? truncate(userNft.owner, 4, 4, 11) : "..."}
                  </small>
                </div>
              </div>

              <div className="flex flex-col">
                <small className="text-xs">Current Price</small>
                <p className="text-sm font-semibold"> Pol</p>
              </div>
            </div>
          </div>

         

          <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
            <input
              className="block w-full text-sm
                text-slate-500 bg-transparent border-0
                focus:outline-none focus:ring-0"
              type="number"
              step={0.01}
              min={0.01}
              name="price"
              placeholder="Price (Pol)"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="flex flex-row justify-center items-center
              w-full text-white text-md bg-[#e32970]
              hover:bg-[#bd255f] py-2 px-5 rounded-full
              drop-shadow-xl border border-transparent
              hover:bg-transparent hover:text-[#e32970]
              hover:border hover:border-[#bd255f]
              focus:outline-none focus:ring mt-5"
          >
            List Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResellNft;
