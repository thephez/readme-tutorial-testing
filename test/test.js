/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
const Identifier = require('@dashevo/dpp/lib/Identifier');
const Dash = require('dash');
const { assert, expect } = require('chai');
const faker = require('faker');
const dotenv = require('dotenv');
const tutorials = require('../tutorials');

dotenv.config();
const mnemonic = process.env.WALLET_MNEMONIC;

let emptyWalletClient;
let sdkClient;
let identity;
let checkForIdentity = false;

describe('Tutorial Code Tests', function suite() {
  this.timeout(30000);

  describe('Initial preparation', function () {
    before(function () {
      emptyWalletClient = new Dash.Client({
        wallet: {
          mnemonic: null,
        },
        // dapiAddresses: ['127.0.0.1:3000'],
      });
    });

    it('Client should connect without error', async function () {
      const result = await tutorials.checkNetworkConnection(emptyWalletClient);
      expect(result).to.have.lengthOf(64);
    });

    xit('Should create a wallet and get an unused address without error', async function () {
      const result = await tutorials.getNewWalletInfo(emptyWalletClient);
      // console.log(result);
      assert.hasAllKeys(result, ['mnemonic', 'address']);
      expect(result.mnemonic.split(' '), 'mnemonic words').to.have.lengthOf(12);
    }).timeout(300000);

    after(function () {
      emptyWalletClient.disconnect();
    });
  });

  describe('Identities and Names', function () {
    let name;

    before(function () {
      // Switch to using received mnemonic for client
      sdkClient = new Dash.Client({
        wallet: {
          mnemonic,
        },
        // dapiAddresses: ['127.0.0.1:3000'],
      });
    });

    it('Client should connect without error', async function () {
      const result = await tutorials.checkNetworkConnection(sdkClient);
      expect(result).to.have.lengthOf(64);
    });

    it('Client wallet should have a balance > 0', async function () {
      const account = await sdkClient.getWalletAccount();
      const balance = await account.getTotalBalance();
      console.log(`\tCurrent balance: ${balance}`);
      expect(balance, 'account balance').to.be.greaterThan(0);
    }).timeout(360000);

    it('Should create an identity', async function () {
      checkForIdentity = true;
      identity = await tutorials.createIdentity(sdkClient);
      // console.log(identity.toJSON());
      assert.containsAllKeys(identity.toJSON(), ['id', 'publicKeys', 'balance', 'revision']);
    }).timeout(45000);

    it('Should topup the identity', async function () {
      assert.isDefined(identity);

      const startBalance = identity.balance;
      const identityToppedUp = await tutorials.topupIdentity(sdkClient, identity.id);

      expect(identityToppedUp.toJSON()).to.include.all.keys('id', 'publicKeys', 'balance', 'revision');
      expect(identityToppedUp.balance).to.not.equal(startBalance);
    });

    it('Should retrieve all account identity IDs', async function () {
      assert.isDefined(identity);

      const identityIds = await tutorials.retrieveIdentityIds(sdkClient);
      // console.log(identityIds);
      expect(identityIds).to.be.an('array').that.has.lengthOf.at.least(1);
      expect(identityIds).to.include(identity.toJSON().id);
    });

    it('Should register a name', async function () {
      assert.isDefined(identity);

      name = `rt-${faker.name.firstName()}-${faker.random.number()}`;
      const registeredName = await tutorials.registerName(sdkClient, identity.id, name);
      console.log(`\tRegistered ${name}`);
      expect(registeredName.toJSON().label).to.equal(name);
    });

    xit('Should register an alias', async function () {
      assert.isDefined(identity);
      const alias = `${name}-alias`;
      console.log(alias);
      const registeredAlias = await tutorials.registerName(sdkClient, identity.id, alias);
      expect(registeredAlias.toJSON().label).to.equal(alias);
    }).timeout(45000);

    it('Should retrieve a name by name', async function () {
      assert.isDefined(identity);
      const retrievedName = await tutorials.retrieveNameByName(sdkClient, name);

      expect(retrievedName.toJSON().label).to.equal(name);
    });

    it('Should retrieve a name by record', async function () {
      assert.isDefined(identity);
      const retrievedName = await tutorials.retrieveNameByRecord(sdkClient, identity.id);

      expect(retrievedName).to.be.an('array').that.has.lengthOf.at.least(1);
      expect(retrievedName[0]).to.be.an('object');
      expect(retrievedName[0].toJSON().label).to.equal(name);
    });

    it('Should retrieve a name by search', async function () {
      assert.isDefined(identity);
      const retrievedName = await tutorials.retrieveNameBySearch(sdkClient, name.toLowerCase());

      expect(retrievedName).to.be.an('array').that.has.lengthOf.at.least(1);
      expect(retrievedName[0]).to.be.an('object');
      expect(retrievedName[0].toJSON().label).to.equal(name);
    });

    afterEach(function () {
      if (checkForIdentity === true) {
        assert.isDefined(identity);
        if (identity === 'undefined') {
          console.error('No identity. Skip remaining tests.');
          this.skip();
        }
      }
    });
  });

  describe('Contracts and Documents', function () {
    let contract;
    let contractId;
    let retrievedContract;
    let documentId;
    const noteMessage = `Tutorial CI Test @ ${new Date().toUTCString()}`;
    const updatedNoteMessage = `${noteMessage} (updated)`;

    it('Should create a contract', async function () {
      assert.isDefined(identity);
      const contractTransition = await tutorials.registerContract(sdkClient, identity.id);
      contract = contractTransition.toJSON().dataContract;
      console.log(`\tRegistered contract ${contract.$id}`);

      assert.containsAllKeys(contract.documents, ['note']);
    });

    it('Should retrieve the contract', async function () {
      assert.isDefined(contract);
      contractId = contract.$id;
      retrievedContract = await tutorials.retrieveContract(sdkClient, contractId);

      expect(retrievedContract.toJSON()).to.deep.equal(contract);

      // Manually add contract with name "tutorialContract"
      sdkClient.apps.apps.tutorialContract = {
        contractId: Identifier.from(contractId),
        retrievedContract,
      };
    });

    it('Should submit a new document', async function () {
      assert.isDefined(contract);
      // console.log(sdkClient.getApps());
      const documentBatchTransition = await tutorials.submitNoteDocument(
        sdkClient,
        identity.id,
        noteMessage,
      );
      // console.log(documentBatchTransition);

      documentId = documentBatchTransition.transitions[0].id;
      expect(documentBatchTransition).to.be.an('object');
    }).timeout();

    it('Should get the document', async function () {
      assert.isDefined(contract);
      const documents = await tutorials.getDocuments(sdkClient);
      // console.log(documents);

      expect(documents, 'number of documents').to.have.lengthOf(1);
      expect(documents[0].getData().message).to.deep.equal(noteMessage);
    });

    it('Should update the document', async function () {
      assert.isDefined(contract);
      const documentBatchTransition = await tutorials.updateNoteDocument(
        sdkClient,
        identity.id,
        documentId,
        updatedNoteMessage,
      );

      // console.log(documentBatchTransition);
      expect(documentBatchTransition).to.be.an('object');
    });

    it('Should get the updated document', async function () {
      assert.isDefined(contract);
      const documents = await tutorials.getDocuments(sdkClient);
      // console.log(documents);

      expect(documents, 'number of documents').to.have.lengthOf(1);
      expect(documents[0].getData().message).to.deep.equal(updatedNoteMessage);
    });

    it('Should delete the document', async function () {
      assert.isDefined(contract);
      const documentBatchTransition = await tutorials.deleteNoteDocument(
        sdkClient,
        identity.id,
        documentId,
      );

      // console.log(documentBatchTransition);
      expect(documentBatchTransition).to.be.an('object');
    });

    it('Should retrieve no documents', async function () {
      assert.isDefined(contract);
      const documents = await tutorials.getDocuments(sdkClient);
      // console.log(documents);

      expect(documents, 'number of documents').to.have.lengthOf(0);
    });

    after(function () {
      sdkClient.disconnect();
    });
  });
});
