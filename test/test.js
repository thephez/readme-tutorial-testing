/* eslint-disable operator-linebreak */
/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
const Dash = require('dash');
const { ExtendedDocument } = require('@dashevo/wasm-dpp/');
const { assert, expect } = require('chai');
const faker = require('faker');
const dotenv = require('dotenv');
const goodNodes = require('./goodNodes');
const tutorials = require('../tutorials');
const minimalContractDocumentSchema = require('../tutorials/contract/contracts/contractMinimal.json');
const indexedContractDocumentSchema = require('../tutorials/contract/contracts/contractWithIndex.json');
const timestampContractDocumentSchema = require('../tutorials/contract/contracts/contractWithTimestamps.json');
const refContractDocumentSchema = require('../tutorials/contract/contracts/contractWithRef.json');
const refContractDefinitions = require('../tutorials/contract/contracts/contractWithRefDefinitions.json');
const binaryContractDocumentSchema = require('../tutorials/contract/contracts/contractWithBinaryData.json');
const nftContractDocumentSchema = require('../tutorials/contract/contracts/contractNft.json');

const {
  PlatformProtocol: { Identity },
  PlatformProtocol: { DataContract },
} = Dash;

dotenv.config();
const mnemonic = process.env.WALLET_MNEMONIC;
const newIdentityBalance = 9999000; // ~ minimum credit balance of new identity
const initialName = 'Tutorial-Test-000000'; // Used to make docs query tests easier
const syncStartHeight = process.env.SYNC_START_HEIGHT;
const network = process.env.NETWORK;

// Force names to be at least 20 characters for test purposes so they register immediately rather
// than going to a contested vote
function generateName(base) {
  const minLength = 20;
  const number = faker.datatype.number();

  // Calculate the remaining length needed to reach the minimum length
  const remainingLength = minLength - base.length;

  // Pad the number to ensure the total length is at least 20 characters
  let paddedNumber = String(number);
  if (remainingLength > 0) {
    paddedNumber = paddedNumber.padStart(remainingLength + paddedNumber.length, '0');
  }

  return base + paddedNumber;
}

function selectRandomNodes(nodeList, count = 2) {
  // eslint-disable-next-line prefer-const
  let selectedNodes = [];
  while (selectedNodes.length < count) {
    const randomNode = nodeList[Math.floor(Math.random() * nodeList.length)];

    // Ensure no duplicates
    if (!selectedNodes.includes(randomNode)) {
      selectedNodes.push(randomNode);
    }
  }

  return selectedNodes;
}

// eslint-disable-next-line prefer-const
let selectedNodes = selectRandomNodes(goodNodes.goodNodes, 2);
// selectedNode = '35.88.162.148:1443:self-signed'; // devnet
// selectedNode = '127.0.0.1:3000';

let noWalletClient;
let emptyWalletClient;
let sdkClient;
let account;
let identity;
let checkForIdentity = false;
let identityUpdated = false;

describe(`Tutorial Code Tests (${new Date().toLocaleTimeString()})`, function suite() {
  this.timeout(50000);

  describe('Initial preparation', function () {
    before(function () {
      // selectedNode = '127.0.0.1:3000';
      console.log(
        `\tUsing nodes ${selectedNodes} for tests. Network type: ${network}`,
      );
      emptyWalletClient = new Dash.Client({
        network,
        wallet: {
          mnemonic: null,
          offlineMode: true,
        },
        // Comment out for local networks
        dapiAddresses: selectedNodes,
      });
    });

    it('Client should connect without error', async function () {
      const result = await tutorials.checkNetworkConnection(emptyWalletClient);
      expect(result).to.have.lengthOf(64);
    });

    it('Should create a wallet and get an unused address without error', async function () {
      const result = await tutorials.getNewWalletInfo(emptyWalletClient);
      console.log(`\tMnemonic: ${result.mnemonic}`);
      console.log(`\tAddress: ${result.address}`);
      assert.hasAllKeys(result, ['mnemonic', 'address']);
      expect(result.mnemonic.split(' '), 'mnemonic words').to.have.lengthOf(12);
    }).timeout(30000);

    after(function () {
      emptyWalletClient.disconnect();
    });
  });

  describe('Identities and Names', function () {
    let name;
    let walletIdentityIds;
    before(function () {
      // selectedNode = '127.0.0.1:3000';
      console.log(`\tUsing nodes ${selectedNodes} for tests`);

      // Client with no wallet for read-only operations
      noWalletClient = new Dash.Client({
        network,
        // Comment out for local networks
        dapiAddresses: selectedNodes,
      });

      // Switch to using received mnemonic for client
      sdkClient = new Dash.Client({
        network,
        wallet: {
          mnemonic,
          unsafeOptions: {
            skipSynchronizationBeforeHeight: syncStartHeight,
          },
        },
        // Comment out for local networks
        dapiAddresses: selectedNodes,
      });
    });

    beforeEach(function () {
      if (checkForIdentity === true) {
        if (identity === 'undefined') {
          console.log('\tIdentity undefined. Skipping test');
          this.skip();
        }
      }
    });

    it('Client should connect without error', async function () {
      const result = await tutorials.checkNetworkConnection(sdkClient);
      expect(result).to.have.lengthOf(64);
    });

    it('Client wallet should have a balance > 0', async function () {
      console.log(`\tSyncing wallet from height: ${syncStartHeight}`);
      account = await sdkClient.getWalletAccount();
      const balance = await account.getTotalBalance();
      console.log(`\tCurrent balance: ${balance}`);
      expect(balance, 'account balance').to.be.greaterThan(0);
    }).timeout(600000);

    it('Should create an identity', async function () {
      checkForIdentity = true;
      assert.isDefined(account);
      identity = await tutorials.createIdentity(sdkClient);
      console.log(`\tRegistered identity: ${identity.toJSON().id}`);
      expect(identity).to.be.instanceOf(Identity);
      // New identity credit balance should be (10000 duffs - a small fee) * 1000
      expect(identity.balance).to.be.above(newIdentityBalance);
      // assert.containsAllKeys(identity.toJSON(), ['id', 'publicKeys', 'balance', 'revision']);
    }).timeout(60000);

    it('Should retrieve the identity', async function () {
      if (typeof identity === 'undefined') {
        console.log('\t Skipping the test. Expected identity to be defined.');
        return this.skip();
      }
      const retrievedIdentity = await tutorials.retrieveIdentity(
        sdkClient,
        identity.toJSON().id,
      );
      expect(retrievedIdentity).to.be.instanceOf(Identity);
    });

    it('Should topup the identity', async function () {
      if (typeof identity === 'undefined') {
        console.log('\t Skipping the test. Expected identity to be defined.');
        return this.skip();
      }

      const startBalance = identity.balance;
      const identityToppedUp = await tutorials.topupIdentity(
        sdkClient,
        identity.toJSON().id,
      );
      // console.log(`New balance: ${identityToppedUp.balance}`);
      expect(identityToppedUp).to.be.instanceOf(Identity);
      expect(identityToppedUp.balance).to.not.equal(startBalance);
    });

    it('Should retrieve all account identity IDs', async function () {
      if (typeof identity === 'undefined') {
        console.log('\t Skipping the test. Expected identity to be defined.');
        return this.skip();
      }

      walletIdentityIds = await tutorials.retrieveIdentityIds(sdkClient);
      // console.log(walletIdentityIds);
      expect(walletIdentityIds).to.be.an('array').that.has.lengthOf.at.least(1);
      expect(walletIdentityIds).to.include(identity.toJSON().id);
    });

    it('Should update the identity (add key)', async function () {
      if (typeof identity === 'undefined') {
        console.log('\t Skipping the test. Expected identity to be defined.');
        return this.skip();
      }
      const startingKeyCount = identity.toJSON().publicKeys.length;
      const identityKeyAdded = await tutorials.updateIdentityAddKey(
        sdkClient,
        identity.toJSON().id,
        startingKeyCount, // 0-based index
      );
      // console.log(identityKeyAdded.toJSON().publicKeys);
      expect(identityKeyAdded).to.be.instanceOf(Identity);
      expect(identityKeyAdded.toJSON().publicKeys.length).to.equal(
        startingKeyCount + 1,
      );
      identity = identityKeyAdded; // Update identity for use in following tests
      identityUpdated = true;
    });

    it('Should update the identity (disable key)', async function () {
      if (identityUpdated === false) {
        console.log('\tNew identity key not added. Skip disabling a key.');
        return this.skip();
      }
      const keyIdToDisable = identity.toJSON().publicKeys.slice(-1)[0].id;
      const identityKeyDisabled = await tutorials.updateIdentityDisableKey(
        sdkClient,
        identity.toJSON().id,
        keyIdToDisable,
      );
      // console.log(identityKeyDisabled.getPublicKeyById(keyIdToDisable));
      expect(identityKeyDisabled).to.be.instanceOf(Identity);
      // eslint-disable-next-line no-unused-expressions
      expect(identityKeyDisabled.toJSON().publicKeys.slice(-1)[0].disabledAt).to
        .exist;
      // eslint-disable-next-line no-unused-expressions
      expect(identity.toJSON().publicKeys.slice(-1)[0].disabledAt).to.not.exist;
    });

    it('Should transfer credits to another identity', async function () {
      if (typeof identity === 'undefined') {
        console.log('\t Skipping the test. Expected identity to be defined.');
        return this.skip();
      }

      if (walletIdentityIds.length < 2) {
        console.log('\t Skipping the test. Not enough identities created with this mnemonic yet.');
        return this.skip();
      }

      const recipientId = walletIdentityIds[0];
      const recipientIdentity = await sdkClient.platform.identities.get(
        recipientId,
      );
      const startBalance = recipientIdentity.balance;

      const identityTransferRecipient = await tutorials.transferCredits(
        sdkClient,
        identity.toJSON().id,
        recipientId,
      );
      console.log(`\tNew balance: ${identityTransferRecipient.balance} (${recipientId})`);
      expect(identityTransferRecipient).to.be.instanceOf(Identity);
      expect(identityTransferRecipient.balance).to.not.equal(startBalance);
    });

    it('Should withdraw credits from Platform', async function () {
      if (typeof identity === 'undefined') {
        console.log('\t Skipping the test. Expected identity to be defined.');
        return this.skip();
      }

      const identityId = identity.toJSON().id;
      const startingIdentity = await sdkClient.platform.identities.get(
        identityId,
      );
      const startBalance = startingIdentity.balance;
      console.log(`\tIdentity balance before withdrawal: ${startBalance}`);

      const toAddress = account.getUnusedAddress().address;
      const creditWithdrawalAmount = 1000000;
      // console.log(
      //   `\tWithdrawing ${creditWithdrawalAmount} credits to ${toAddress}`,
      // );

      const endingIdentity = await tutorials.withdrawCredits(
        sdkClient,
        startingIdentity,
        toAddress,
        creditWithdrawalAmount,
      );

      const balanceChange = endingIdentity.balance - startBalance;
      console.log(
        `\tIdentity balance after withdrawal: ${endingIdentity.balance} (Change: ${balanceChange})`,
      );
      expect(endingIdentity).to.be.instanceOf(Identity);
      expect(endingIdentity.balance).to.not.equal(startBalance);
    });

    it('Should register a name', async function () {
      if (typeof identity === 'undefined') {
        console.log('\t Skipping the test. Expected identity to be defined.');
        return this.skip();
      }

      // Check if initial name already established on this network
      const retrievedName = await tutorials.retrieveNameByName(
        noWalletClient,
        initialName,
      );

      if (retrievedName === null) {
        name = initialName;
      } else {
        name = generateName(`Tutorial-Test-${faker.name.firstName()}-`);
      }

      const registeredName = await tutorials.registerName(
        sdkClient,
        identity.toJSON().id,
        name,
      );
      console.log(
        `\tRegistered ${name} (Document id: ${registeredName.toJSON().$id})`,
      );
      expect(registeredName.toJSON().label).to.equal(name);
    });

    // Aliases are no longer present since https://github.com/dashpay/platform/pull/1984
    it('Should register another name', async function () {
      if (typeof identity === 'undefined') {
        console.log('\t Skipping the test. Expected identity to be defined.');
        return this.skip();
      }
      // Check if initial name already established on this network
      const retrievedName = await tutorials.retrieveNameByName(
        noWalletClient,
        initialName,
      );

      if (retrievedName === null) {
        console.log('\t Skipping the test. Expected name to be defined.');
        return this.skip();
      }

      const backupName = `${name}-backup`;

      const registeredBackupName = await tutorials.registerName(
        sdkClient,
        identity.toJSON().id,
        backupName,
      );
      console.log(`\tRegistered ${backupName} (${registeredBackupName.toJSON().$id})`);
      expect(registeredBackupName.toJSON().label).to.equal(backupName);
    }).timeout(60000);

    it('Should retrieve a name by name', async function () {
      if (typeof identity === 'undefined') {
        console.log('\t Skipping the test. Expected identity to be defined.');
        return this.skip();
      }
      const retrievedName = await tutorials.retrieveNameByName(
        noWalletClient,
        name,
      );

      expect(retrievedName.toJSON().label).to.equal(name);
    });

    it('Should retrieve a name by record', async function () {
      if (typeof identity === 'undefined') {
        console.log('\t Skipping the test. Expected identity to be defined.');
        return this.skip();
      }
      const retrievedName = await tutorials.retrieveNameByRecord(
        noWalletClient,
        identity.toJSON().id,
      );

      expect(retrievedName).to.be.an('array').that.has.lengthOf.at.least(1);
      expect(retrievedName.some(item => item.toJSON().label === name)).to.be.true;
    });

    it('Should retrieve a name by search', async function () {
      if (typeof identity === 'undefined') {
        console.log('\t Skipping the test. Expected identity to be defined.');
        return this.skip();
      }
      const retrievedName = await tutorials.retrieveNameBySearch(
        noWalletClient,
        name,
      );

      expect(retrievedName).to.be.an('array').that.has.lengthOf.at.least(1);
      expect(retrievedName[0]).to.be.an('object');
      expect(retrievedName[0].toJSON().label).to.equal(name);
    });
  });

  describe('Contracts and Documents', function () {
    let contract;
    let updatedContract;
    let contractId;
    let retrievedContract;
    let documentId;
    const noteMessage = `Tutorial CI Test @ ${new Date().toUTCString()}`;
    const updatedNoteMessage = `${noteMessage} (updated)`;

    it('Should create a minimal contract', async function () {
      if (typeof identity === 'undefined') {
        console.log('\t Skipping the test. Expected identity to be defined.');
        return this.skip();
      }
      // eslint-disable-next-line max-len
      const contractTransition = await tutorials.registerContractProvided(
        sdkClient,
        identity.toJSON().id,
        minimalContractDocumentSchema,
      );
      // console.log(contractTransition.toJSON());
      contract = contractTransition.toJSON();
      console.log(
        `\tRegistered minimal contract: ${contract.id} ${contract.version}`,
      );

      assert.containsAllKeys(contract.documentSchemas, ['note']);
    });

    it('Should retrieve the contract', async function () {
      if (typeof contract === 'undefined') {
        console.log('\t Skipping the test. Expected contract to be defined.');
        return this.skip();
      }
      contractId = contract.id;
      retrievedContract = await tutorials.retrieveContract(
        noWalletClient,
        contractId,
      );
      // console.dir(retrievedContract.toJSON(), { depth: 5 })
      expect(retrievedContract).to.be.instanceOf(DataContract);
      // expect(retrievedContract.toJSON()).to.deep.equal(contract); // TODO: update to work with v0.24

      // Manually add contract with name "tutorialContract"
      sdkClient.getApps().set('tutorialContract', {
        contractId: retrievedContract.getId(),
        contract: retrievedContract,
      });
      noWalletClient.getApps().set('tutorialContract', {
        contractId: retrievedContract.getId(),
        contract: retrievedContract,
      });
    });

    it('Should submit a new document to be updated then deleted', async function () {
      if (typeof contract === 'undefined') {
        console.log('\t Skipping the test. Expected contract to be defined.');
        return this.skip();
      }
      // console.log(sdkClient.getApps());
      const documentBatchTransition = await tutorials.submitNoteDocument(
        sdkClient,
        identity.toJSON().id,
        noteMessage,
      );
      // console.log(documentBatchTransition.toJSON());

      documentId = documentBatchTransition.toJSON().$id;
      expect(documentBatchTransition.toJSON()).to.be.an('object');
    }).timeout();

    it('Should get the document', async function () {
      if (typeof contract === 'undefined') {
        console.log('\t Skipping the test. Expected contract to be defined.');
        return this.skip();
      }
      if (typeof documentId === 'undefined') {
        console.log('\t Skipping the test. Expected documentId to be defined.');
        return this.skip();
      }
      const documents = await tutorials.getDocuments(noWalletClient);
      // console.log(documents[0].toJSON());

      expect(documents, 'number of documents').to.have.lengthOf(1);
      expect(documents[0]).to.be.instanceOf(ExtendedDocument);
      expect(documents[0].getData().message).to.deep.equal(noteMessage);
    });

    it('Should update the document', async function () {
      if (typeof contract === 'undefined') {
        console.log('\t Skipping the test. Expected contract to be defined.');
        return this.skip();
      }
      if (typeof documentId === 'undefined') {
        console.log('\t Skipping the test. Expected documentId to be defined.');
        return this.skip();
      }
      const documentBatchTransition = await tutorials.updateNoteDocument(
        sdkClient,
        identity.toJSON().id,
        documentId,
        updatedNoteMessage,
      );

      // console.log(documentBatchTransition.toJSON());
      expect(documentBatchTransition.toJSON()).to.be.an('object');
    });

    it('Should get the updated document', async function () {
      if (typeof contract === 'undefined') {
        console.log('\t Skipping the test. Expected contract to be defined.');
        return this.skip();
      }
      if (typeof documentId === 'undefined') {
        console.log('\t Skipping the test. Expected documentId to be defined.');
        return this.skip();
      }
      const documents = await tutorials.getDocuments(noWalletClient);
      // console.log(documents);

      expect(documents, 'number of documents').to.have.lengthOf(1);
      expect(documents[0]).to.be.instanceOf(ExtendedDocument);
      expect(documents[0].getData().message).to.deep.equal(updatedNoteMessage);
    });

    it('Should delete the document', async function () {
      if (typeof contract === 'undefined') {
        console.log('\t Skipping the test. Expected contract to be defined.');
        return this.skip();
      }
      if (typeof documentId === 'undefined') {
        console.log('\t Skipping the test. Expected documentId to be defined.');
        return this.skip();
      }
      const documentBatchTransition = await tutorials.deleteNoteDocument(
        sdkClient,
        identity.toJSON().id,
        documentId,
      );

      // console.log(documentBatchTransition.toJSON());
      expect(documentBatchTransition).to.be.an('object');
    });

    it('Should retrieve no documents', async function () {
      if (typeof contract === 'undefined') {
        console.log('\t Skipping the test. Expected contract to be defined.');
        return this.skip();
      }
      if (typeof documentId === 'undefined') {
        console.log('\t Skipping the test. Expected documentId to be defined.');
        return this.skip();
      }
      const documents = await tutorials.getDocuments(noWalletClient);
      // console.log(documents);

      expect(documents, 'number of documents').to.have.lengthOf(0);
    });

    it('Should submit a new document', async function () {
      if (typeof contract === 'undefined') {
        console.log('\t Skipping the test. Expected contract to be defined.');
        return this.skip();
      }
      const documentBatchTransition = await tutorials.submitNoteDocument(
        sdkClient,
        identity.toJSON().id,
        noteMessage,
      );

      documentId = documentBatchTransition.toJSON().$id;
      console.log(`\tSubmitted document: ${documentId}`);
      expect(documentBatchTransition).to.be.an('object');
    }).timeout();

    it('Should update the contract', async function () {
      if (typeof contract === 'undefined') {
        console.log('\t Skipping the test. Expected contract to be defined.');
        return this.skip();
      }
      // eslint-disable-next-line max-len
      const contractTransition = await tutorials.updateContractProvided(
        sdkClient,
        identity.toJSON().id,
        contractId,
        'note',
      );
      updatedContract = contractTransition.toJSON();
      console.log(`\tUpdated minimal contract: ${updatedContract.id}`);

      assert.containsAllKeys(updatedContract.documentSchemas, ['note']);
      assert.containsAllKeys(updatedContract.documentSchemas.note.properties, [
        'message',
        'author',
      ]);
    }).timeout();

    describe('Additional Contracts', function () {
      it('Should create a contract with indices', async function () {
        if (typeof identity === 'undefined') {
          console.log('\t Skipping the test. Expected identity to be defined.');
          return this.skip();
        }
        // eslint-disable-next-line max-len
        const contractTransition = await tutorials.registerContractProvided(
          sdkClient,
          identity.toJSON().id,
          indexedContractDocumentSchema,
        );
        const indexedContract = contractTransition.toJSON();
        console.log(
          `\tRegistered contract with indices: ${indexedContract.id}`,
        );

        assert.containsAllKeys(indexedContract.documentSchemas.note, [
          'indices',
        ]);
      });

      it('Should create a contract with timestamps required', async function () {
        if (typeof identity === 'undefined') {
          console.log('\t Skipping the test. Expected identity to be defined.');
          return this.skip();
        }
        // eslint-disable-next-line max-len
        const contractTransition = await tutorials.registerContractProvided(
          sdkClient,
          identity.toJSON().id,
          timestampContractDocumentSchema,
        );
        const timestampContract = contractTransition.toJSON();
        console.log(
          `\tRegistered contract with timestamps required: ${timestampContract.id}`,
        );

        expect(timestampContract.documentSchemas.note.required).to.include(
          '$createdAt',
          '$updatedAt',
        );
      });

      xit('Should create a contract with $ref', async function () {
        if (typeof identity === 'undefined') {
          console.log('\t Skipping the test. Expected identity to be defined.');
          return this.skip();
        }
        // eslint-disable-next-line max-len
        const contractTransition = await tutorials.registerContractProvided(
          sdkClient,
          identity.toJSON().id,
          refContractDocumentSchema,
          refContractDefinitions,
        );
        const refContract = contractTransition.toJSON();
        console.log(`\tRegistered contract with $ref: ${refContract.id}`);

        expect(refContract.$defs).to.be.an('object');
        expect(refContract.$defs).to.have.property('address');
      });

      it('Should create a contract with binary data', async function () {
        if (typeof identity === 'undefined') {
          console.log('\t Skipping the test. Expected identity to be defined.');
          return this.skip();
        }
        // eslint-disable-next-line max-len
        const contractTransition = await tutorials.registerContractProvided(
          sdkClient,
          identity.toJSON().id,
          binaryContractDocumentSchema,
        );
        const binaryContract = contractTransition.toJSON();
        console.log(
          `\tRegistered contract with binary data: ${binaryContract.id}`,
        );

        expect(
          binaryContract.documentSchemas.block.properties.hash,
        ).to.have.property('byteArray');
      });

      it('Should create an NFT contract', async function () {
        if (typeof identity === 'undefined') {
          console.log('\t Skipping the test. Expected identity to be defined.');
          return this.skip();
        }
        // eslint-disable-next-line max-len
        const contractTransition = await tutorials.registerContractProvided(
          sdkClient,
          identity.toJSON().id,
          nftContractDocumentSchema,
        );
        const nftContract = contractTransition.toJSON();
        console.log(
          `\tRegistered NFT contract: ${nftContract.id}`,
        );

        expect(nftContract.documentSchemas).to.have.property(
          'card',
        );
      });
    });
  });

  describe('Misc', function () {
    it('Should send a transaction', async function () {
      if (typeof identity === 'undefined') {
        console.log(
          '\tExpected identity to be defined. Skipping the test to minimize UTXO growth.',
        );
        return this.skip();
      }
      const txid = await tutorials.sendFunds(sdkClient);
      console.log(`\tTransaction broadcast: ${txid}`);
      expect(txid).to.have.a.lengthOf(64);
    });

    it('Should execute DAPI client methods and return Dash Core status', async function () {
      const status = await tutorials.dapiClientMethods(noWalletClient);
      // console.dir(status);
      expect(status).to.include.all.keys(
        'version',
        'time',
        'status',
        'syncProgress',
        'chain',
        'network',
      );
      expect(status.version).to.include.all.keys(
        'software',
        'protocol',
        'agent',
      );
      expect(status.chain).to.include.all.keys(
        'name',
        'headersCount',
        'blocksCount',
        'bestBlockHash',
        'difficulty',
        'chainWork',
        'isSynced',
        'syncProgress',
      );
    });

    after(function () {
      sdkClient.disconnect();
      noWalletClient.disconnect();
    });
  });
});
