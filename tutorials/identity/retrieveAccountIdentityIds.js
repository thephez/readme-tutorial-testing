/* const Dash = require('dash');

const client = new Dash.Client({
  network: 'testnet',
  wallet: {
    mnemonic: 'a Dash wallet mnemonic with testnet funds goes here',
  },
}); */

async function retrieveAccountIdentityIds(client) {
  const account = await client.getWalletAccount();
  return account.identities.getIdentityIds();
}

/* retrieveIdentityIds()
  .then((d) => console.log('Mnemonic identities:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e))
  .finally(() => client.disconnect()); */

module.exports.retrieveIdentityIds = retrieveAccountIdentityIds;
