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
const { IdentityPublicKey, IdentityPublicKeyWithWitness } = require('@dashevo/wasm-dpp');

async function updateIdentityAddKey(sdkClient, identityId, keyId) {
  const existingIdentity = await sdkClient.platform.identities.get(identityId);
  // console.log(existingIdentity.toJSON());

  const account = await sdkClient.platform.client.getWalletAccount();
  const identityIndex = await account.getUnusedIdentityIndex();
  // console.log(`Unused identity index: ${identityIndex}`);
  // console.log(existingIdentity.getPublicKeyById(identityIndex));

  // eslint-disable-next-line operator-linebreak
  const { privateKey: identityPrivateKey } =
    account.identities.getIdentityHDKeyByIndex(identityIndex, 0);

  const identityPublicKey = identityPrivateKey.toPublicKey().toBuffer();

  const newPublicKey = new IdentityPublicKeyWithWitness({
    id: keyId,
    type: IdentityPublicKey.TYPES.ECDSA_SECP256K1,
    data: identityPublicKey,
    purpose: IdentityPublicKey.PURPOSES.AUTHENTICATION,
    securityLevel: IdentityPublicKey.SECURITY_LEVELS.CRITICAL,
    readOnly: false,
    signature: Buffer.alloc(0),
  });

  // console.log(newPublicKey.toJSON());

  const updateAdd = {
    add: [newPublicKey],
  };

  // console.log(updateAdd);

  await sdkClient.platform.identities.update(existingIdentity, updateAdd, {
    [newPublicKey.getId()]: identityPrivateKey,
  });

  return sdkClient.platform.identities.get(identityId);
}

/* updateIdentityAddKey(client,)
  .then((d) => console.log('Identity:\n', d.toJSON()))
  .catch((e) => console.error('Something went wrong:\n', e))
  .finally(() => client.disconnect()); */

module.exports.updateIdentityAddKey = updateIdentityAddKey;
