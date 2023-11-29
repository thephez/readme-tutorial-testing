/* eslint-disable no-console */
/* const Dash = require('dash');

const clientOpts = {
  wallet: {
    mnemonic: 'a Dash wallet mnemonic with funds goes here',
  },
};
const client = new Dash.Client(clientOpts); */

async function updateContract(client, identityId, contractId, schema) {
  const { platform } = client;
  const identity = await platform.identities.get(identityId);

  const existingDataContract = await platform.contracts.get(contractId);
  const documentSchema = existingDataContract.getDocumentSchema(schema);
  // console.dir({documentSchema})
  documentSchema.properties.author = {
    type: 'string',
    position: 1,
  };

  existingDataContract.setDocumentSchema(schema, documentSchema);
  // console.dir({existingDataContract}, {depth:null})

  // Sign and submit the data contract
  await platform.contracts.update(existingDataContract, identity);
  return existingDataContract;
}

/* updateContract()
  .then((d) => console.log('Contract updated:\n', d.toJSON()))
  .catch((e) => console.error('Something went wrong:\n', e))
  .finally(() => client.disconnect()); */

module.exports.updateContractProvided = updateContract;
