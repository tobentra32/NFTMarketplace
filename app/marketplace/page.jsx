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
    const MarketplaceAddress = '0xb7db51952B405f41a1E9A72f82ef775fECC26fb3'


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

        console.log('signer:', signer);
        // The Contract object
        const MarketplaceAbi = Marketplace.abi;
        console.log('MarketplaceAbi:', MarketplaceAbi);


        const marketplaceContract = new Contract(MarketplaceAddress, MarketplaceAbi, signer)

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
            const pinata = new PinataSDK({
                pinataJwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlYmE2MmMzOC01YjIzLTQ2YzYtYjg2Yy01ZDAyZWY1MWM5NDYiLCJlbWFpbCI6InRvYmVudHJhMzJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjIwNWMwN2UxMTgxNDBlOGM2MTM0Iiwic2NvcGVkS2V5U2VjcmV0IjoiMDZmZTNmMmM3ODI0ZTVkN2M4NTExMzU4OTMzMWY5ZGY4MThlZTViZGQwYjEwYmQzZTUxNGNiMTNjNDNlMGY2NCIsImV4cCI6MTc2Njc5MjM5MX0.4ZIGX_iZmwEYZYm9eOc4Fc-s6xHBk5qRyM9fJaY31n0",
                pinataGateway: "teal-tropical-aphid-906.mypinata.cloud/ipfs/",
            });


            const gatewayurl = resolvePinataIPFS(tokenURI);

            console.log("gatewayurl", gatewayurl);
            const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlYmE2MmMzOC01YjIzLTQ2YzYtYjg2Yy01ZDAyZWY1MWM5NDYiLCJlbWFpbCI6InRvYmVudHJhMzJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjIwNWMwN2UxMTgxNDBlOGM2MTM0Iiwic2NvcGVkS2V5U2VjcmV0IjoiMDZmZTNmMmM3ODI0ZTVkN2M4NTExMzU4OTMzMWY5ZGY4MThlZTViZGQwYjEwYmQzZTUxNGNiMTNjNDNlMGY2NCIsImV4cCI6MTc2Njc5MjM5MX0.4ZIGX_iZmwEYZYm9eOc4Fc-s6xHBk5qRyM9fJaY31n0";
            async function url() {
                try {
                  const payload = JSON.stringify({
                    url: `https://teal-tropical-aphid-906.mypinata.cloud/files/${gatewayurl}`,
                    expires: 500000,

                    method: "GET"
                  })

                  const request = await fetch(
                    `https://api.pinata.cloud/v3/files/sign`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${JWT}`,
                    },
                    body: payload
                  });
                  const response = await request.json();
                  console.log(response);
                } catch (error) {
                  console.log(error);
                }
            }

            url();




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