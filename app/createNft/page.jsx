"use client";

import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { ethers } from "ethers";

import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";
import { BrowserProvider, Contract, formatUnits } from "ethers";

import lighthouse from "@lighthouse-web3/sdk";

const CreateNft = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [message, updateMessage] = useState("");

  const [fileUrl, setFileUrl] = useState("");
  const [imgBase64, setImgBase64] = useState(null);

  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const { address, caipAddress, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");

  const uploadFile = async (file) => {
    // Push file to lighthouse node
    // Both file and folder are supported by upload function
    // Third parameter is for multiple files, if multiple files are to be uploaded at once make it true
    // Fourth parameter is the deal parameters, default null
    console.log("uploading");
    const output = await lighthouse.upload(
      file,
      "4a6b492b.bf633a1883224e21b2d6186eafa2eef3"
    );
    console.log("File Status:", output);
    setFileUrl(`https://gateway.lighthouse.storage/ipfs/${output.data.Hash}`);
    /*
      output:
        data: {
          Name: "filename.txt",
          Size: 88000,
          Hash: "QmWNmn2gr4ZihNPqaC5oTeePsHvFtkWNpjY3cD6Fd5am1w"
        }
      Note: Hash in response is CID.
    */

    console.log(fileUrl);
    return fileUrl;
  };

  const MarketplaceAddress = "0x8F989D8F8c6CEDd3B1871802E9565622Bd2595B4";

  async function uploadMetadataToIPFS() {
    console.log("fileUrl: ", fileUrl);

    updateMessage("Uploading data to IPFS... Please wait...");

    //Make sure that none of the fields are empty
    if (!title || !description || !price || !fileUrl) {
      updateMessage("Please fill all the fields!");
      return -1;
    }
    const metadataJson = {
      title,
      description,
      image: fileUrl,
      price,
    }

    // Convert JSON to Blob
    const blob = new Blob([JSON.stringify(metadataJson)], { type: "application/json" });
    const jsonFile = new File([blob], "data.json", { type: "application/json" });
    console.log("metadataJson: ", jsonFile);
    try {
      const apiKey = "4a6b492b.bf633a1883224e21b2d6186eafa2eef3";

      const metadataOutput = await lighthouse.uploadBuffer(jsonFile, apiKey);
      console.log("metadata Status:", metadataOutput);

      const metadataUrl = `https://gateway.lighthouse.storage/ipfs/${metadataOutput.data.Hash}`;
      console.log(metadataUrl);
      return metadataUrl;
    } catch (error) {
      console.log(error);
    }
  }

  async function listNFT(e) {
    e.preventDefault();

    //Upload data to IPFS
    try {
      const metadataURL = await uploadMetadataToIPFS();
      console.log(metadataURL);
      if (metadataURL === -1) return;
      //After adding your Hardhat network to your metamask, this code will get providers and signers

      if (!isConnected) throw Error("User disconnected");

      const ethersProvider = new BrowserProvider(walletProvider);

      console.log("ethersProvider:", ethersProvider);

      const signer = await ethersProvider.getSigner();

      console.log("signer:", signer);
      // The Contract object
      const MarketplaceAbi = [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "ERC721IncorrectOwner",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "operator",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "ERC721InsufficientApproval",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "approver",
              type: "address",
            },
          ],
          name: "ERC721InvalidApprover",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "operator",
              type: "address",
            },
          ],
          name: "ERC721InvalidOperator",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "ERC721InvalidOwner",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "receiver",
              type: "address",
            },
          ],
          name: "ERC721InvalidReceiver",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "ERC721InvalidSender",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "ERC721NonexistentToken",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "approved",
              type: "address",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "Approval",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "operator",
              type: "address",
            },
            {
              indexed: false,
              internalType: "bool",
              name: "approved",
              type: "bool",
            },
          ],
          name: "ApprovalForAll",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "_fromTokenId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "_toTokenId",
              type: "uint256",
            },
          ],
          name: "BatchMetadataUpdate",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "address",
              name: "seller",
              type: "address",
            },
            {
              indexed: false,
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "price",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "bool",
              name: "sold",
              type: "bool",
            },
          ],
          name: "MarketItemCreated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "_tokenId",
              type: "uint256",
            },
          ],
          name: "MetadataUpdate",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "Transfer",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "approve",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "balanceOf",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "createMarketSale",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "tokenURI",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "price",
              type: "uint256",
            },
          ],
          name: "createToken",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [],
          name: "fetchItemsListed",
          outputs: [
            {
              components: [
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
                {
                  internalType: "address payable",
                  name: "seller",
                  type: "address",
                },
                {
                  internalType: "address payable",
                  name: "owner",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "price",
                  type: "uint256",
                },
                {
                  internalType: "bool",
                  name: "sold",
                  type: "bool",
                },
              ],
              internalType: "struct NFTMarketplace.MarketItem[]",
              name: "",
              type: "tuple[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "fetchMarketItems",
          outputs: [
            {
              components: [
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
                {
                  internalType: "address payable",
                  name: "seller",
                  type: "address",
                },
                {
                  internalType: "address payable",
                  name: "owner",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "price",
                  type: "uint256",
                },
                {
                  internalType: "bool",
                  name: "sold",
                  type: "bool",
                },
              ],
              internalType: "struct NFTMarketplace.MarketItem[]",
              name: "",
              type: "tuple[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "fetchMyNFTs",
          outputs: [
            {
              components: [
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
                {
                  internalType: "address payable",
                  name: "seller",
                  type: "address",
                },
                {
                  internalType: "address payable",
                  name: "owner",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "price",
                  type: "uint256",
                },
                {
                  internalType: "bool",
                  name: "sold",
                  type: "bool",
                },
              ],
              internalType: "struct NFTMarketplace.MarketItem[]",
              name: "",
              type: "tuple[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "getApproved",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getListingPrice",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getOwner",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "address",
              name: "operator",
              type: "address",
            },
          ],
          name: "isApprovedForAll",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "name",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "ownerOf",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "price",
              type: "uint256",
            },
          ],
          name: "resellToken",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "safeTransferFrom",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
          ],
          name: "safeTransferFrom",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "operator",
              type: "address",
            },
            {
              internalType: "bool",
              name: "approved",
              type: "bool",
            },
          ],
          name: "setApprovalForAll",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes4",
              name: "interfaceId",
              type: "bytes4",
            },
          ],
          name: "supportsInterface",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "symbol",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "tokenURI",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "transferFrom",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_listingPrice",
              type: "uint256",
            },
          ],
          name: "updateListingPrice",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
      ];

      //console.log('MarketplaceAbi:', MarketplaceAbi);

      const marketplaceContract = new Contract(
        MarketplaceAddress,
        MarketplaceAbi,
        signer,
      );

      console.log("marketplaceContract:", marketplaceContract);

      updateMessage(
        "Uploading NFT(takes 5 mins).. please dont click anything!",
      );

      //Pull the deployed contract instance

      //massage the params to be sent to the create NFT request
      const nft_price = ethers.parseUnits(price, "ether");
      console.log("nft price:", nft_price);
      let listingPrice = await marketplaceContract.getListingPrice();
      listingPrice = listingPrice.toString();
      console.log("listingPrice:", listingPrice);

      //actually create the NFT
      let transaction = await marketplaceContract.createToken(
        metadataURL,
        nft_price,
        { value: listingPrice },
      );
      await transaction.wait();
      console.log("transaction:", transaction);
      console.log("transation hash: ", transaction.hash);

      alert("Successfully listed your NFT!");

      updateMessage("");

      window.location.replace("/");
    } catch (e) {
      alert("Upload error" + e);
    }
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center
      justify-center bg-black bg-opacity-50 transform
      transition-transform duration-300 `}
    >
      <div className="bg-[#151c25] shadow-xl shadow-[#e32970] rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <form className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold text-gray-400">Add NFT</p>
          </div>

          <div className="flex flex-row justify-center items-center rounded-xl mt-5">
            <div className="shrink-0 rounded-xl overflow-hidden h-20 w-20">
              <img
                alt="NFT"
                className="h-full w-full object-cover cursor-pointer"
                src={
                  imgBase64 ||
                  "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1361&q=80"
                }
              />
            </div>
          </div>

          <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
            <label className="block">
              <span className="sr-only">Choose profile photo</span>
              <input
                type="file"
                accept="image/png, image/gif, image/jpeg, image/webp"
                className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-[#19212c] file:text-gray-400
                hover:file:bg-[#1d2631]
                cursor-pointer focus:ring-0 focus:outline-none"
                onChange={(e) => uploadFile(e.target.files)}
                required
              />
            </label>
          </div>

          <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
            <input
              className="block w-full text-sm
              text-slate-500 bg-transparent border-0
              focus:outline-none focus:ring-0"
              type="text"
              name="title"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              required
            />
          </div>

          <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
            <input
              className="block w-full text-sm
              text-slate-500 bg-transparent border-0
              focus:outline-none focus:ring-0"
              type="number"
              step={0.01}
              min={0.001}
              name="price"
              placeholder="Price (ETH)"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>

          <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
            <textarea
              className="block w-full text-sm resize-none
              text-slate-500 bg-transparent border-0
              focus:outline-none focus:ring-0 h-20"
              type="text"
              name="description"
              placeholder="Description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            onClick={listNFT}
            className="flex flex-row justify-center items-center
            w-full text-white text-md bg-[#e32970]
            hover:bg-[#bd255f] py-2 px-5 rounded-full
            drop-shadow-xl border border-transparent
            hover:bg-transparent hover:text-[#e32970]
            hover:border hover:border-[#bd255f]
            focus:outline-none focus:ring mt-5"
          >
            Mint Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNft;
