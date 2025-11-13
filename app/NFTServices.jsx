
import { setGlobalState, getGlobalState, setAlert } from './store';

import { BrowserProvider, Contract, parseEther, ether } from "ethers";

import contractAbi from "./contract_info/contractAbi";

const nft_address = "0x70060798786f46af79392d71fa3197D052620892"


const createNFT = async ({ title, description, tokenURI, price, walletProvider }) => {
  try {
    //price = window.web3.utils.toWei(price.toString(), 'ether')
    //const account = getGlobalState('connectedAccount')
    price = price.toString();
    console.log('price:', price);
    price = parseEther(price);
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    const contract = new Contract(nft_address, contractAbi, signer);
    const tx = await contract.createToken(tokenURI, price, title, description, {
      value: parseEther("0.00025"),
    } );
    await tx.wait();
    return true
  } catch (error) {
    console.log("error:", error);
  }
}

const buyNFT = async ({ tokenId, price, walletProvider}) => {
  try {
    console.log('Buying nft with tokenId:', tokenId);
    console.log('Using walletProvider:', walletProvider);
    console.log('Price:', price);
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    console.log('Signer:', signer);
    const contract = new Contract(nft_address, contractAbi, signer);
    console.log('Contract:', contract);
    const buy = await contract.createMarketSale(tokenId, { value: price });
      
    await buy.wait();
    console.log("tx", buy);
    
  } catch (error) {
    reportError(error)
  }
}

const resellNFT = async ({ tokenId, price, walletProvider}) => {
  try {

    console.log('Reselling nft with tokenId:', tokenId);
    console.log('Using walletProvider:', walletProvider);
    console.log('Price:', price);
    const ethersProvider = new BrowserProvider(walletProvider);
    console.log('ethersProvider:', ethersProvider);

    const signer = await ethersProvider.getSigner();
    console.log('Signer:', signer);
    
    const contract = new Contract(nft_address, contractAbi, signer);
    console.log('Contract:', contract);
    const buyer = getGlobalState('connectedAccount')
    console.log('buyer:', buyer);
    price = price.toString();
    console.log('price:', price);
    price = parseEther(price);
    
    const tx = await contract.resellToken(tokenId,  price ,{
      value: parseEther("0.00025"),
    });
    await tx.wait();
    console.log("tx", tx);

    //return true
  } catch (error) {
    reportError(error)
  }
}

const getAllNFTs = async ({walletProvider, address}) => {
  try {
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    const contract = new Contract(nft_address, contractAbi, signer);
    //console.log('address:', address);
    setGlobalState('connectedAccount', address.toLowerCase());

    //console.log('contract:', contract);

    const nfts = await contract.fetchMarketItems();
    //console.log('nfts:', nfts);
    const transactions = await contract.fetchMarketItems();

    setGlobalState('nfts', structuredNfts(nfts));
    setGlobalState('transactions', structuredNfts(transactions));
  } catch (error) {
    //reportError(error)
    console.log("error:", error);
  }
}

const updateNFT = async ({ id, cost }) => {
  try {
    cost = window.web3.utils.toWei(cost.toString(), 'ether')
    const contract = await getEtheriumContract()
    //const buyer = getGlobalState('connectedAccount')
    const tx = await contract.createMarketSale(tokenId, walletProvider);

    
  } catch (error) {
    reportError(error)
  }
}

const getMyNFTs = async ({walletProvider}) => {
  try {
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    const contract = new Contract(nft_address, contractAbi, signer);
    //console.log('contract:', contract);

    const myNfts = await contract.fetchMyNFTs();
    //console.log('my-nfts:', myNfts);
    const transactions = await contract.fetchMyNFTs();

    setGlobalState('userNfts', structuredNfts(myNfts));
    setGlobalState('transactions', structuredNfts(transactions));
  } catch (error) {
    reportError(error)
  }
}

const getMyListedNFTs = async ({walletProvider}) => {
  try {
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    const contract = new Contract(nft_address, contractAbi, signer);
    console.log('contract:', contract);

    const listedNfts = await contract.fetchItemsListed();
    console.log('listed-nfts:', listedNfts);
    const transactions = await contract.fetchMarketItems();

    setGlobalState('listedNfts', structuredNfts(listedNfts));
    setGlobalState('transactions', structuredNfts(transactions));
  } catch (error) {
    reportError(error)
  }
}

const reportError = (error) => {
  setAlert(JSON.stringify(error), 'red')
}

const structuredNfts = (nfts) => {
  return nfts
    .map((nft) => ({
      id: Number(nft.tokenId),
      seller: nft.seller.toLowerCase(),
      owner: nft.owner.toLowerCase(),
      price: nft.price.toString(),
      sold: nft.sold,
      title: nft.title,
      description: nft.description,
      tokenURI: nft.tokenURI,
      
    }))
    .reverse()
}

export {
  getAllNFTs,
  getMyNFTs,
  createNFT,
  buyNFT,
  updateNFT,
  getMyListedNFTs,
  resellNFT,
}


