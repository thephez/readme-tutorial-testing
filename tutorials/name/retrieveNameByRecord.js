/* const Dash = require('dash');

const client = new Dash.Client(); */

async function retrieveNameByRecord(client, identityId) {
  // Retrieve by a name's identity ID
  return client.platform.names.resolveByRecord('identity', identityId);
}

/* retrieveNameByRecord()
  .then((d) => console.log('Name retrieved:\n', d[0].toJSON()))
  .catch((e) => console.error('Something went wrong:\n', e))
  .finally(() => client.disconnect()); */

module.exports.retrieveNameByRecord = retrieveNameByRecord;
