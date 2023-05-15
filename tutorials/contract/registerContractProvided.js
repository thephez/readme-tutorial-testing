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

  // Make sure contract passes validation checks
  const validationResult = await platform.dpp.dataContract.validate(contract);

  if (validationResult.isValid()) {
    /* console.log('Validation passed, broadcasting contract..'); */
    // Sign and submit the data contract
    return platform.contracts.publish(contract, identity);
  }
  console.error(validationResult); // An array of detailed validation errors
  throw validationResult.errors[0];
}

/* registerContract()
  .then((d) => console.log('Contract registered:\n', d.toJSON()))
  .catch((e) => console.error('Something went wrong:\n', e))
  .finally(() => client.disconnect()); */

module.exports.registerContractProvided = registerContract;
