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

async function updateNoteDocument(client, identityId, documentId, message) {
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

  // Update document
  // document.set('message', 'Updated document @ ' + new Date().toUTCString());
  document.set('message', message);

  // Sign and submit the document replace transition
  await platform.documents.broadcast({ replace: [document] }, identity);
  return document;
}

/* updateNoteDocument()
  .then((d) => console.log('Document updated:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e))
  .finally(() => client.disconnect()); */

module.exports.updateNoteDocument = updateNoteDocument;
