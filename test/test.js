/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
const Dash = require('dash');
const { assert, expect } = require('chai');
const { checkNetworkConnection } = require('../tutorials/checkNetworkConnection');
const { getNewWalletInfo } = require('../tutorials/getNewWalletInfo');
const { createIdentity } = require('../tutorials/registerAnIdentity');
const { topupIdentity } = require('../tutorials/topupIdentity');

const mnemonic = 'can remember inner harsh fringe student excite alone sense neutral people inflict';
let sdkClient;

describe('Tutorial Code Tests', function suite() {
  describe('Initial preparation', () => {
    before(function () {
      sdkClient = new Dash.Client({
        wallet: {
          mnemonic: null,
        },
        dapiAddresses: ['127.0.0.1:3000'],
      });
    });

    it('Should connect without error', async function () {
      const result = await checkNetworkConnection(sdkClient);
      // assert.ok(result);
      expect(result).to.have.lengthOf(64);
    }).timeout(5000);

    it('Should create a wallet and get an unused address without error', async function () {
      const result = await getNewWalletInfo(sdkClient);
      // console.log(result);
      assert.hasAllKeys(result, ['mnemonic', 'address']);
      expect(result.mnemonic.split(' ')).to.have.lengthOf(12);
    }).timeout(300000);

    after(function () {
      sdkClient.disconnect();
    });
  });

  describe('Identities and Names', () => {
    before(function () {
      // Switch to using received mnemonic for client
      sdkClient = new Dash.Client({
        wallet: {
          mnemonic,
        },
        dapiAddresses: ['127.0.0.1:3000'],
      });
    });

    let identity;

    it('Should create an identity', async function () {
      identity = await createIdentity(sdkClient);
      // console.log(identity.toJSON());
      assert.containsAllKeys(identity.toJSON(), ['id', 'publicKeys', 'balance', 'revision']);
    }).timeout(300000);

    it('Should topup the identity', async function () {
      assert.isDefined(identity);

      const startBalance = identity.balance;
      const identityToppedUp = await topupIdentity(sdkClient, identity.id);

      expect(identityToppedUp.toJSON()).to.include.all.keys('id', 'publicKeys', 'balance', 'revision');
      expect(identityToppedUp.balance).to.not.equal(startBalance);
    }).timeout(20000);

    after(function () {
      sdkClient.disconnect();
    });
  });
});
