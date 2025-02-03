// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

const hre = require('hardhat');

const ethers = require('ethers');



const { vars } = require("hardhat/config");

// Go to https://alchemy.com, sign up, create a new App in
// its dashboard, and add its key to the configuration variables
const PRIVATE_KEY = vars.get("PRIVATE_KEY");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  //const provider = hre.ethers.provider;


  const provider = new ethers.JsonRpcProvider('https://testnet.bitfinity.network');
  const deployerWallet = new ethers.Wallet(
    PRIVATE_KEY,
    provider
  );

  console.log('Deploying contracts with the account:', deployerWallet.address);

  const balance = await provider.getBalance(deployerWallet.address);
  // 4085267032476673080n

  // Since the balance is in wei, you may wish to display it
  // in ether instead.
  const bal = ethers.formatEther(balance)
  // '4.08526703247667308'

  console.log('Deployer account balance:', bal);


  

  const Marketplace = await hre.ethers.getContractFactory('NFTMarketplace');

  const options = {
    gasLimit: 1000000,
    nonce: 3,
  };
  const marketplace = await Marketplace.deploy(options);

  
  
  console.log("Marketplace contract deployed to:", await marketplace.getAddress());

  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });