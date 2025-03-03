"use client"
import React, { useState } from 'react';

import { ethers } from "ethers";
import axios from "axios";

import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react"
import { BrowserProvider, Contract, formatUnits } from 'ethers'
import { PinataSDK } from "pinata";

import Marketplace from '../Marketplace.json'


const MarketPlace = () => {

    const [data, updateData] = useState([]);
    const [dataFetched, updateFetched] = useState(false);
    const { address, caipAddress, isConnected } = useAppKitAccount();
    const { walletProvider } = useAppKitProvider('eip155')
    const MarketplaceAddress = '0x8F989D8F8c6CEDd3B1871802E9565622Bd2595B4'


    async function waitForConnection(timeout = 10000) {
        const start = Date.now();

        while (!isConnected) {
          // Check for timeout
          if (Date.now() - start > timeout) {
            throw new Error("User not connected within timeout");
          }

          // Wait for 500ms before checking again
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }




    async function getAllNFTs() {
        await waitForConnection();
        if (!isConnected) throw Error('User disconnected')

        const ethersProvider = new BrowserProvider(walletProvider)

        console.log('ethersProvider:', ethersProvider);

        const signer = await ethersProvider.getSigner()

        const MarketplaceAddress = "0x8F989D8F8c6CEDd3B1871802E9565622Bd2595B4";

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

        console.log('marketplaceContract:', marketplaceContract);
            //create an NFT Token
        let transaction = await marketplaceContract.fetchMarketItems()

        //Fetch all the details of every NFT from the contract and display
        const items = await Promise.all(transaction.map(async i => {
            var tokenURI = await marketplaceContract.tokenURI(i.tokenId);
            //tokenURI = GetIpfsUrlFromPinata(tokenURI);
            console.log('tokenURI:', tokenURI);


            function resolvePinataIPFS(ipfsUrl) {
                // Replace ipfs:// with Pinata's gateway

                if (ipfsUrl.startsWith("ipfs://")) {
                  return ipfsUrl.replace("ipfs://", "");
                }
                return ipfsUrl;
            }
        




            let price = ethers.formatUnits(i.price.toString(), 'ether');
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.image,
                name: meta.name,
                description: meta.description,
            }
            return item;
        }))

        updateFetched(true);
        updateData(items);
    }

    getAllNFTs();
    return (

        <div>

            <div className="bg-[#151c25] gradient-bg-artworks">
                <div className="w-4/5 py-10 mx-auto">
                    <h4 className="text-white text-3xl font-bold uppercase text-gradient">
                        Latest Artworks
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-4 lg:gap-3 py-2.5">
                        {data.map((value, index) => {

                            return <Card data={value} key={index} />;
                        })}
                    </div>
                    <div className="text-center my-5">
                        <button
                            className="shadow-xl shadow-black text-white
          bg-[#e32970] hover:bg-[#bd255f]
          rounded-full cursor-pointer p-2"
                        >
                            Load More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default MarketPlace;