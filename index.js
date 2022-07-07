/* eslint-disable no-console */
const Dash = require('dash');
const dotenv = require('dotenv');
const tutorials = require('./tutorials');

dotenv.config();
const mnemonic = process.env.WALLET_MNEMONIC;

async function getNewWalletInfo(sdkClient) {
  const account = await sdkClient.getWalletAccount();
  const address = account.getUnusedAddress();
  console.log('Mnemonic:', mnemonic);
  console.log('First account address:', address.address);
  sdkClient.disconnect();
}

const client = new Dash.Client({
  wallet: {
    mnemonic,
    offlineMode: true,
  },
});

tutorials.checkNetworkConnection(client).then((x) => console.log(x));

// Get first address of wallet
getNewWalletInfo(client);
