/* const Dash = require('dash');

const client = new Dash.Client(); */

async function retrieveName(client, name) {
  // Retrieve by full name (e.g., myname.dash)
  // NOTE: Use lowercase characters only
  return client.platform.names.resolve(`${name}.dash`);
}

/* retrieveName()
  .then((d) => console.log('Name retrieved:\n', d.toJSON()))
  .catch((e) => console.error('Something went wrong:\n', e))
  .finally(() => client.disconnect()); */

module.exports.retrieveNameByName = retrieveName;
