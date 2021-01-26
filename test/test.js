const Dash = require('dash');
// const assert = require('assert');
const { assert, expect } = require('chai');
const { checkNetworkConnection } = require('../tutorials/checkNetworkConnection');
const { getNewWalletInfo } = require('../tutorials/getNewWalletInfo');
const { createIdentity } = require('../tutorials/registerAnIdentity')
/* const CreateAndFundWallet = require('../1-create-and-fund-wallet');
let mnemonic = 'can remember inner harsh fringe student excite alone sense neutral people inflict';
let clientOptions = {
  wallet: {
    mnemonic: null,
  },
};
let sdkClient = new Dash.Client(clientOptions);

describe('Tutorial Code Test', function suite() {
  describe('Initial preparation', () => {
    it('should connect to Evonet without error', async function () {
      const result = await checkNetworkConnection(sdkClient);
      assert.ok(result);
    }).timeout(5000);

    it('should create a wallet and get an unused address without error', async function () {
      const result = await getNewWalletInfo(sdkClient);
      console.log(result);
      sdkClient.disconnect();
      assert.hasAllKeys(result, ['mnemonic', 'address']);
      // assert.ifError(result);
    }).timeout(300000);
  });

  // Switch to using received mnemonic for client
  clientOptions = {
    wallet: {
      mnemonic,
    },
  };
  sdkClient = new Dash.Client(clientOptions);

  describe('Identities and Names', () => {
    it('Should create an identity', async function () {
      const result = await createIdentity(sdkClient);
      console.log(result);
      assert.ok(result);
    }).timeout(300000);
  });

  sdkClient.disconnect();

});
