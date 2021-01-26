async function checkNetworkConnection(sdkClient) {
  return sdkClient.getDAPIClient().core.getBestBlockHash();
}

module.exports.checkNetworkConnection = checkNetworkConnection;
