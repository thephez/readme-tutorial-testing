/* eslint-disable global-require */
module.exports = {
  ...require('./checkNetworkConnection.js'),
  ...require('./getNewWalletInfo.js'),
  ...require('./identity/registerIdentity.js'),
  ...require('./identity/topupIdentity.js'),
  ...require('./identity/retrieveAccountIdentityIds'),
  ...require('./name/registerName'),
};
