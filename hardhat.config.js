require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

const { vars } = require("hardhat/config");

// Go to https://alchemy.com, sign up, create a new App in
// its dashboard, and add its key to the configuration variables
const PRIVATE_KEY = vars.get("PRIVATE_KEY");


module.exports = {
  solidity: "0.8.28",
  networks: {
    testnet_bitfinity: {
      url: 'https://testnet.bitfinity.network',
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 355113,
    },
    local_bitfinity: {
      url: 'http://127.0.0.1:8545',
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 355113,
    },
  },
  
};
