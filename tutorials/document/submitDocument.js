/* const Dash = require('dash');

const clientOpts = {
  network: 'testnet',
  wallet: {
    mnemonic: 'a Dash wallet mnemonic with funds goes here',
  },
  apps: {
    tutorialContract: {
      contractId: '6Ti3c7nvD1gDf4gFi8a3FfZVhVLiRsGLnQ7nCAF74osi',
    },
  },
};
const client = new Dash.Client(clientOpts); */

async function submitNoteDocument(client, identityId, message) {
  const { platform } = client;
  const identity = await platform.identities.get(identityId);

  const docProperties = {
    // message: 'Tutorial CI Test @ ' + new Date().toUTCString(),
    message,
  };

  // Create the note document
  const noteDocument = await platform.documents.create(
    'tutorialContract.note',
    identity,
    docProperties,
  );

  const documentBatch = {
    create: [noteDocument], // Document(s) to create
    replace: [], // Document(s) to update
    delete: [], // Document(s) to delete
  };
  // Sign and submit the document(s)
  await platform.documents.broadcast(documentBatch, identity);
  return noteDocument;
}

/* submitNoteDocument()
  .then((d) => console.log(d))
  .catch((e) => console.error('Something went wrong:\n', e))
  .finally(() => client.disconnect()); */

module.exports.submitNoteDocument = submitNoteDocument;
