// const Dash = require('dash');

// const client = new Dash.Client();

async function retrieveIdentity(client, identityId) {
  return client.platform.identities.get(identityId);
}

// retrieveIdentity()
//   .then((d) => console.log('Identity retrieved:\n', d.toJSON()))
//   .catch((e) => console.error('Something went wrong:\n', e))
//   .finally(() => client.disconnect());

module.exports.retrieveIdentity = retrieveIdentity;
