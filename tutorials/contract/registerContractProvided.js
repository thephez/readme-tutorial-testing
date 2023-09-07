/* eslint-disable no-console */
/* const Dash = require('dash');

const clientOpts = {
  wallet: {
    mnemonic: 'a Dash wallet mnemonic with funds goes here',
  },
};
const client = new Dash.Client(clientOpts); */

async function registerContract(
  client,
  identityId,
  contractDocumentSchema,
  contractDefinitions,
) {
  const { platform } = client;
  const identity = await platform.identities.get(identityId);

  // console.dir(contractDocumentSchema, { depth: null });
  const contract = await platform.contracts.create(
    contractDocumentSchema,
    identity,
  );

  // Add reusable definitions referred to by "$ref" to contract
  if (contractDefinitions) {
    contract.setDefinitions(contractDefinitions);
  }
  // console.dir({ contract }, { depth: null });

  // Sign and submit the data contract
  await platform.contracts.publish(contract, identity);
  return contract;
}

/* registerContract()
  .then((d) => console.log('Contract registered:\n', d.toJSON()))
  .catch((e) => console.error('Something went wrong:\n', e))
  .finally(() => client.disconnect()); */

module.exports.registerContractProvided = registerContract;
