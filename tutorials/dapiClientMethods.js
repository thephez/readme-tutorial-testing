/* eslint-disable no-console */
// const Dash = require('dash');

// const client = new Dash.Client();

async function dapiClientMethods(client) {
  console.log(await client.getDAPIClient().core.getBlockHash(1));
  console.log(await client.getDAPIClient().core.getBestBlockHash());
  console.log(await client.getDAPIClient().core.getBlockByHeight(1));
  await client.getDAPIClient().core.getMasternodeStatus();

  return client.getDAPIClient().core.getBlockchainStatus();
}

// dapiClientMethods()
//   .then((d) => console.log('Core status:\n', d))
//   .catch((e) => console.error('Something went wrong:\n', e))
//   .finally(() => client.disconnect());

module.exports.dapiClientMethods = dapiClientMethods;
