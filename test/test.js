/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
const Dash = require('dash');
const DataContract = require('@dashevo/dpp/lib/dataContract/DataContract');
const Document = require('@dashevo/dpp/lib/document/Document');
const Identifier = require('@dashevo/dpp/lib/Identifier');
const Identity = require('@dashevo/dpp/lib/identity/Identity');
const { assert, expect } = require('chai');
const faker = require('faker');
const dotenv = require('dotenv');
const tutorials = require('../tutorials');

dotenv.config();
const mnemonic = process.env.WALLET_MNEMONIC;
const goodNodes = ['52.36.244.225:3000', '52.39.164.105:3000', '54.185.249.226:3000', '34.219.169.55:3000', '54.213.219.155:3000', '35.165.207.13:3000', '34.220.41.134:3000', '18.237.204.153:3000', '54.191.15.3:3000', '34.212.231.240:3000', '35.163.99.20:3000', '18.237.5.33:3000', '54.191.32.70:3000', '34.215.192.133:3000', '52.34.141.75:3000', '54.201.239.109:3000', '18.236.233.120:3000', '34.210.81.39:3000', '174.34.233.127:3000', '34.221.42.205:3000', '54.188.17.60:3000', '54.184.140.221:3000', '174.34.233.129:3000', '54.212.75.8:3000', '34.222.127.158:3000', '34.220.17.107:3000', '34.221.254.29:3000', '34.216.195.19:3000', '35.160.140.37:3000', '54.70.65.199:3000', '34.220.53.77:3000', '54.244.41.15:3000', '54.201.162.86:3000', '34.211.244.117:3000', '34.223.226.224:3000', '52.40.101.104:3000', '54.185.1.69:3000', '54.190.73.116:3000', '52.26.220.40:3000', '34.219.93.145:3000', '34.218.76.179:3000', '54.212.84.164:3000', '54.191.227.118:3000', '174.34.233.133:3000', '52.11.133.244:3000', '18.237.128.46:3000', '54.202.194.212:3000', '174.34.233.113:3000', '52.32.232.156:3000', '54.218.127.128:3000', '174.34.233.109:3000', '174.34.233.126:3000', '54.71.107.225:3000', '54.187.11.213:3000', '18.236.216.191:3000', '174.34.233.117:3000', '34.208.190.130:3000', '54.201.189.185:3000', '34.222.135.203:3000', '54.191.237.52:3000', '54.201.42.245:3000', '52.41.198.242:3000', '34.220.74.48:3000', '54.149.252.146:3000', '174.34.233.110:3000', '54.148.215.161:3000', '54.149.80.193:3000', '35.166.57.113:3000', '34.222.168.33:3000', '34.222.102.137:3000', '174.34.233.108:3000', '34.217.28.248:3000', '174.34.233.118:3000', '52.13.119.69:3000', '34.215.55.0:3000', '18.236.160.247:3000', '54.185.249.172:3000', '34.219.94.178:3000', '34.213.5.102:3000', '34.214.102.160:3000', '174.34.233.134:3000', '54.191.110.152:3000', '35.167.25.157:3000', '174.34.233.120:3000', '35.166.79.235:3000', '54.189.87.145:3000', '174.34.233.102:3000', '212.24.101.211:3000', '18.236.169.114:3000', '54.203.241.214:3000', '54.189.162.193:3000', '54.218.70.46:3000', '54.70.55.164:3000', '34.220.88.70:3000', '34.215.67.224:3000', '54.148.106.179:3000', '34.212.226.44:3000', '52.38.77.105:3000', '174.34.233.121:3000', '35.160.13.25:3000', '34.215.57.86:3000', '34.222.6.55:3000', '54.68.10.46:3000', '174.34.233.104:3000', '54.218.251.43:3000', '54.187.229.6:3000', '54.218.104.194:3000', '54.187.50.120:3000', '34.212.65.137:3000', '18.236.199.232:3000', '34.220.228.214:3000', '52.11.252.174:3000', '54.191.221.246:3000', '34.209.166.42:3000', '34.217.98.54:3000', '174.34.233.116:3000', '34.222.242.228:3000', '54.187.224.80:3000', '174.34.233.125:3000', '54.188.193.70:3000', '54.213.89.75:3000', '140.82.15.143:3000', '34.219.81.129:3000', '174.34.233.130:3000', '54.184.183.20:3000', '54.202.157.120:3000', '174.34.233.106:3000', '54.190.217.178:3000', '34.220.12.188:3000', '18.236.128.49:3000', '174.34.233.105:3000', '52.32.143.49:3000', '34.220.144.226:3000', '34.212.178.215:3000', '54.245.197.173:3000', '34.217.43.189:3000', '34.222.225.76:3000', '35.163.152.74:3000', '174.34.233.115:3000', '54.201.242.241:3000', '174.34.233.128:3000', '35.165.37.186:3000', '34.216.200.22:3000', '54.214.68.206:3000', '52.43.197.215:3000', '54.212.18.218:3000', '34.219.36.94:3000', '34.211.49.3:3000', '18.236.78.191:3000', '34.215.146.162:3000'];
// eslint-disable-next-line prefer-const
let selectedNode = goodNodes[Math.floor(Math.random() * goodNodes.length)];
// selectedNode = '127.0.0.1:3000';

let emptyWalletClient;
let sdkClient;
let account;
let identity;
let checkForIdentity = false;

describe(`Tutorial Code Tests (${new Date().toLocaleTimeString()})`, function suite() {
  this.timeout(40000);

  describe('Initial preparation', function () {
    before(function () {
      // selectedNode = '127.0.0.1:3000';
      console.log(`\tUsing node ${selectedNode} for tests`);
      emptyWalletClient = new Dash.Client({
        wallet: {
          mnemonic: null,
        },
        dapiAddresses: [selectedNode],
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
      // selectedNode = '127.0.0.1:3000';
      console.log(`\tUsing node ${selectedNode} for tests`);
      // Switch to using received mnemonic for client
      sdkClient = new Dash.Client({
        wallet: {
          mnemonic,
        },
        dapiAddresses: [selectedNode],
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
      account = await sdkClient.getWalletAccount();
      const balance = await account.getTotalBalance();
      console.log(`\tCurrent balance: ${balance}`);
      expect(balance, 'account balance').to.be.greaterThan(0);
    }).timeout(600000);

    it('Should create an identity', async function () {
      checkForIdentity = true;
      assert.isDefined(account);
      identity = await tutorials.createIdentity(sdkClient);
      console.log(`\tRegistered identity: ${identity.id}`);
      expect(identity).to.be.instanceOf(Identity);
      // assert.containsAllKeys(identity.toJSON(), ['id', 'publicKeys', 'balance', 'revision']);
    }).timeout(120000);

    it('Should topup the identity', async function () {
      // assert.isDefined(identity);

      const startBalance = identity.balance;
      const identityToppedUp = await tutorials.topupIdentity(sdkClient, identity.id);

      expect(identityToppedUp).to.be.instanceOf(Identity);
      expect(identityToppedUp.balance).to.not.equal(startBalance);
    });

    it('Should retrieve all account identity IDs', async function () {
      // assert.isDefined(identity);

      const identityIds = await tutorials.retrieveIdentityIds(sdkClient);
      // console.log(identityIds);
      expect(identityIds).to.be.an('array').that.has.lengthOf.at.least(1);
      expect(identityIds).to.include(identity.toJSON().id);
    });

    it('Should register a name', async function () {
      // assert.isDefined(identity);

      name = `rt-${faker.name.firstName()}-${faker.random.number()}`;
      const registeredName = await tutorials.registerName(sdkClient, identity.id, name);
      console.log(`\tRegistered ${name}`);
      expect(registeredName.toJSON().label).to.equal(name);
    });

    it('Should register an alias', async function () {
      // assert.isDefined(identity);
      const alias = `${name}-alias`;

      const registeredAlias = await tutorials.registerAlias(sdkClient, identity.id, alias);
      expect(registeredAlias.toJSON().label).to.equal(alias);
    });

    it('Should retrieve a name by name', async function () {
      // assert.isDefined(identity);
      const retrievedName = await tutorials.retrieveNameByName(sdkClient, name);

      expect(retrievedName.toJSON().label).to.equal(name);
    });

    it('Should retrieve a name by record', async function () {
      // assert.isDefined(identity);
      const retrievedName = await tutorials.retrieveNameByRecord(sdkClient, identity.id);

      expect(retrievedName).to.be.an('array').that.has.lengthOf.at.least(1);
      expect(retrievedName[0]).to.be.an('object');
      expect(retrievedName[0].toJSON().label).to.equal(name);
    });

    it('Should retrieve a name by search', async function () {
      // assert.isDefined(identity);
      const retrievedName = await tutorials.retrieveNameBySearch(sdkClient, name.toLowerCase());

      expect(retrievedName).to.be.an('array').that.has.lengthOf.at.least(1);
      expect(retrievedName[0]).to.be.an('object');
      expect(retrievedName[0].toJSON().label).to.equal(name);
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

      expect(retrievedContract).to.be.instanceOf(DataContract);
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
      expect(documents[0]).to.be.instanceOf(Document);
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
      expect(documents[0]).to.be.instanceOf(Document);
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
