/* const Dash = require('dash');

const clientOpts = {
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

async function deleteNoteDocument(client, identityId, documentId) {
  const { platform } = client;
  const identity = await platform.identities.get(identityId);
  // const documentId = 'an existing document ID goes here';

  // Retrieve the existing document
  const [document] = await client.platform.documents.get(
    'tutorialContract.note',
    {
      where: [['$id', '==', documentId]],
    },
  );

  // Sign and submit the document delete transition
  await platform.documents.broadcast({ delete: [document] }, identity);
  return document;
}

/* deleteNoteDocument()
  .then((d) => console.log('Document deleted:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e))
  .finally(() => client.disconnect()); */

module.exports.deleteNoteDocument = deleteNoteDocument;
