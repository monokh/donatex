const HDWalletProvider = require('truffle-hdwallet-provider')
const fs = require('fs')

let mnemonic;
if (fs.existsSync('secrets.json')) {
  mnemonic = JSON.parse(fs.readFileSync('secrets.json', 'utf8')).mnemonic;
  console.log(mnemonic);
}

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    kovan: {
      provider: new HDWalletProvider(mnemonic, 'https://kovan.infura.io/'),
      network_id: 1
    },
    ropsten: {
      provider: new HDWalletProvider(mnemonic, 'https://ropsten.infura.io/'),
      network_id: 2
    },
    mainnet: {
      provider: new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/'),
      network_id: 3,
      gasPrice: 100000000
    }
  }
};
