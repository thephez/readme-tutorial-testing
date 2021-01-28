/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
const Dash = require('dash');
const { assert, expect } = require('chai');
const faker = require('faker');
const dotenv = require('dotenv');
const tutorials = require('../tutorials');

const mnemonic = 'can remember inner harsh fringe student excite alone sense neutral people inflict';

let emptyWalletClient;
let sdkClient;

describe('Tutorial Code Tests', function suite() {
  this.timeout(10000);

  describe('Initial preparation', function () {
    before(function () {
      emptyWalletClient = new Dash.Client({
        wallet: {
          mnemonic: null,
        },
        // dapiAddresses: ['127.0.0.1:3000'],
      });
    });

    it('Should connect without error', async function () {
      const result = await tutorials.checkNetworkConnection(emptyWalletClient);
      expect(result).to.have.lengthOf(64);
    });

    it('Should create a wallet and get an unused address without error', async function () {
      const result = await tutorials.getNewWalletInfo(emptyWalletClient);
      // console.log(result);
      assert.hasAllKeys(result, ['mnemonic', 'address']);
      expect(result.mnemonic.split(' ')).to.have.lengthOf(12);
    }).timeout(300000);

    after(function () {
      emptyWalletClient.disconnect();
    });
  });

  describe('Identities and Names', function () {
    let identity;
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

    it('Should create an identity', async function () {
      identity = await tutorials.createIdentity(sdkClient);
      // console.log(identity.toJSON());
      assert.containsAllKeys(identity.toJSON(), ['id', 'publicKeys', 'balance', 'revision']);
    }).timeout(300000);

    it('Should topup the identity', async function () {
      if (typeof identity === 'undefined') {
        this.skip();
      }
      assert.isDefined(identity);

      const startBalance = identity.balance;
      const identityToppedUp = await tutorials.topupIdentity(sdkClient, identity.id);

      expect(identityToppedUp.toJSON()).to.include.all.keys('id', 'publicKeys', 'balance', 'revision');
      expect(identityToppedUp.balance).to.not.equal(startBalance);
    }).timeout(20000);

    it('Should retrieve all account identity IDs', async function () {
      const identityIds = await tutorials.retrieveIdentityIds(sdkClient);
      // console.log(identityIds);
      // console.log(identity.toJSON());
      expect(identityIds).to.be.an('array').that.has.lengthOf.at.least(1);
      expect(identityIds).to.include(identity.toJSON().id);
    });

    after(function () {
      sdkClient.disconnect();
    });
  });
});
