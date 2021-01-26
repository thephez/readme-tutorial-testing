/* eslint-disable no-console */
/* const Dash = require('dash');

const clientOpts = {
  network: 'testnet',
  wallet: {
    mnemonic: null, // this indicates that we want a new wallet to be generated
                    // if you want to get a new address for an existing wallet
                    // replace 'null' with an existing wallet mnemonic
  },
};

const client = new Dash.Client(clientOpts); */

async function getNewWalletInfo(sdkClient) {
  const account = await sdkClient.getWalletAccount();

  const mnemonic = sdkClient.wallet.exportWallet();
  const address = account.getUnusedAddress();
  // console.log('Mnemonic:', mnemonic);
  // console.log('Unused address:', address.address);
  return { mnemonic, address: address.address };
}

/* createWallet()
  .catch((e) => console.error('Something went wrong:\n', e))
  .finally(() => client.disconnect()); */

module.exports.getNewWalletInfo = getNewWalletInfo;
