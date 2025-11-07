
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

const buyNFT = async ({ tokenId, walletProvider}) => {
  try {
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    const contract = new Contract(nft_address, contractAbi, signer);
    const buyer = getGlobalState('connectedAccount')

    const tx = await contract.createMarketSale(tokenId, walletProvider);

    return true
  } catch (error) {
    reportError(error)
  }
}

const getAllNFTs = async ({walletProvider}) => {
  try {
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    const contract = new Contract(nft_address, contractAbi, signer);

    const nfts = await contract.fetchMarketItems();
    const transactions = await contract.fetchMarketItems();

    setGlobalState('nfts', structuredNfts(nfts))
    setGlobalState('transactions', structuredNfts(transactions))
  } catch (error) {
    reportError(error)
  }
}

const updateNFT = async ({ id, cost }) => {
  try {
    cost = window.web3.utils.toWei(cost.toString(), 'ether')
    const contract = await getEtheriumContract()
    const buyer = getGlobalState('connectedAccount')

    await contract.methods.changePrice(Number(id), cost).send({ from: buyer })
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
      seller: nft.seller,
      owner: nft.owner.toLowerCase(),
      price: parseEther(nft.price),
      sold: nft.sold,
      title: nft.title,
      description: nft.description,
      metadataURI: nft.tokenURI,
      
    }))
    .reverse()
}


export {
  getAllNFTs,
  connectWallet,
  createNFT,
  buyNFT,
  updateNFT,
  isWallectConnected,
}


