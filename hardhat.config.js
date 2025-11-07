require("@nomicfoundation/hardhat-toolbox");

// Ensure your configuration variables are set before executing the script
const { vars } = require("hardhat/config");


const ALCHEMY_API_KEY = vars.get("ALCHEMY_API_KEY");

// Add your Sepolia account private key to the configuration variables
// To export your private key from Coinbase Wallet, go to
// Settings > Developer Settings > Show private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Beware: NEVER put real Ether into testing accounts
const PRIVATE_KEY = vars.get("PRIVATE_KEY");
const KITE_RPC_URL = vars.get("KITE_RPC_URL");
const KITE_CHAIN_ID = vars.get("KITE_CHAIN_ID");


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  settings: { optimizer: { enabled: true, runs: 200 } },
  networks: {
    hardhat: {},
    polygonAmoy: {
      url: "https://rpc-amoy.polygon.technology",
      chainId: 80002,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  }
};
