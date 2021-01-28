/* const Dash = require('dash');

const client = new Dash.Client(); */

async function retrieveContract(client, contractId) {
  /* const contractId = '6Ti3c7nvD1gDf4gFi8a3FfZVhVLiRsGLnQ7nCAF74osi'; */
  return client.platform.contracts.get(contractId);
}

/* retrieveContract()
  .then((d) => console.dir(d.toJSON(), { depth: 5 }))
  .catch((e) => console.error('Something went wrong:\n', e))
  .finally(() => client.disconnect()); */

module.exports.retrieveContract = retrieveContract;
