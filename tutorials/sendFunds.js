// const Dash = require('dash');

// const clientOpts = {
//   network: 'testnet',
//   wallet: {
//     mnemonic: 'your wallet mnemonic goes here',
//     unsafeOptions: {
//       skipSynchronizationBeforeHeight: 415000, // only sync from start of 2021
//     },
//   },
// };
// const client = new Dash.Client(clientOpts);

async function sendFunds(client) {
  const account = await client.getWalletAccount();

  const transaction = account.createTransaction({
    recipient: 'yP8A3cbdxRtLRduy5mXDsBnJtMzHWs6ZXr', // Testnet2 faucet
    satoshis: 1000, // 0.00001 Dash
  });
  return account.broadcastTransaction(transaction);
}

// sendFunds()
//   .then((d) => console.log('Transaction broadcast!\nTransaction ID:', d))
//   .catch((e) => console.error('Something went wrong:\n', e))
//   .finally(() => client.disconnect());

module.exports.sendFunds = sendFunds;
