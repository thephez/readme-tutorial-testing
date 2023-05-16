/* const Dash = require('dash');

const clientOpts = {
  network: 'testnet',
  wallet: {
    mnemonic: 'a Dash wallet mnemonic with testnet funds goes here',
  },
};
const client = new Dash.Client(clientOpts); */

async function topupIdentity(sdkClient, identityId) {
  // const identityId = 'an identity ID goes here';
  const topUpAmount = 300000; // Number of duffs

  await sdkClient.platform.identities.topUp(identityId, topUpAmount);
  return sdkClient.platform.identities.get(identityId);
}

/* topupIdentity()
  .then((d) => console.log('Identity credit balance: ', d.balance))
  .catch((e) => console.error('Something went wrong:\n', e))
  .finally(() => client.disconnect()); */

module.exports.topupIdentity = topupIdentity;
