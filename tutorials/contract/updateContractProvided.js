/* eslint-disable no-console */
/* const Dash = require('dash');

const clientOpts = {
  wallet: {
    mnemonic: 'a Dash wallet mnemonic with funds goes here',
  },
};
const client = new Dash.Client(clientOpts); */

async function updateContract(client, identityId, contractId) {
  const { platform } = client;
  const identity = await platform.identities.get(identityId);

  const existingDataContract = await platform.contracts.get(contractId);
  const documents = existingDataContract.getDocuments();
  // console.dir({documents})
  documents.note.properties.author = {
    type: 'string',
  };

  existingDataContract.setDocuments(documents);
  // console.dir({existingDataContract}, {depth:null})

  // Make sure contract passes validation checks
  await platform.dpp.initialize();
  const validationResult = await platform.dpp.dataContract.validate(
    existingDataContract,
  );

  if (validationResult.isValid()) {
    // console.log('Validation passed, broadcasting contract..');
    // Sign and submit the data contract
    return platform.contracts.update(existingDataContract, identity);
  }
  console.error(validationResult); // An array of detailed validation errors
  throw validationResult.errors[0];
}

/* updateContract()
  .then((d) => console.log('Contract updated:\n', d.toJSON()))
  .catch((e) => console.error('Something went wrong:\n', e))
  .finally(() => client.disconnect()); */

module.exports.updateContractProvided = updateContract;
