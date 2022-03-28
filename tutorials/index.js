/* eslint-disable global-require */
module.exports = {
  ...require('./checkNetworkConnection.js'),
  ...require('./getNewWalletInfo.js'),
  ...require('./identity/registerIdentity.js'),
  ...require('./identity/retrieveIdentity.js'),
  ...require('./identity/topupIdentity.js'),
  ...require('./identity/retrieveAccountIdentityIds'),
  ...require('./name/registerName'),
  ...require('./name/registerAlias'),
  ...require('./name/retrieveNameByName'),
  ...require('./name/retrieveNameByRecord'),
  ...require('./name/retrieveNameBySearch'),
  ...require('./contract/registerContract'),
  ...require('./contract/registerContractProvided'),
  ...require('./contract/updateContractProvided'),
  ...require('./contract/retrieveContract'),
  ...require('./document/submitDocument'),
  ...require('./document/getDocument'),
  ...require('./document/updateDocument'),
  ...require('./document/deleteDocument'),
  ...require('./sendFunds'),
  ...require('./dapiClientMethods'),
};
