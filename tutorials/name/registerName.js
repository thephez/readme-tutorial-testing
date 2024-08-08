/* const Dash = require('dash');

const clientOpts = {
  wallet: {
    mnemonic: 'a Dash wallet mnemonic with testnet funds goes here',
  },
};
const client = new Dash.Client(clientOpts); */

async function registerName(client, identityId, name) {
  const { platform } = client;

  const identity = await platform.identities.get(identityId);
  const nameRegistration = await platform.names.register(
    `${name}.dash`,
    { identity: identity.getId() },
    identity,
  );

  return nameRegistration;
}

/* registerName()
  .then((d) => console.log('Name registered:\n', d.toJSON()))
  .catch((e) => console.error('Something went wrong:\n', e))
  .finally(() => client.disconnect()); */

module.exports.registerName = registerName;
