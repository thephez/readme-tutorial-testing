/* const Dash = require('dash');

const clientOpts = {
  network: 'testnet',
  wallet: {
    mnemonic: 'a Dash wallet mnemonic with testnet funds goes here',
  },
};
const client = new Dash.Client(clientOpts);
const identityId = '';
const keyId = 1; */

async function updateIdentityDisableKey(sdkClient, identityId, keyId) {
  const existingIdentity = await sdkClient.platform.identities.get(identityId);
  // console.log(existingIdentity.toJSON());

  const publicKeyToDisable = existingIdentity.getPublicKeyById(keyId);
  // console.log(publicKeyToDisable);

  const updateDisable = {
    disable: [publicKeyToDisable],
  };

  await sdkClient.platform.identities.update(existingIdentity, updateDisable);

  return sdkClient.platform.identities.get(identityId);
}

/* updateIdentityDisableKey(client,)
  .then((d) => console.log('Identity:\n', d.toJSON()))
  .catch((e) => console.error('Something went wrong:\n', e))
  .finally(() => client.disconnect()); */

module.exports.updateIdentityDisableKey = updateIdentityDisableKey;
