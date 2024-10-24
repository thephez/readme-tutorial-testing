async function withdrawCredits(client, identity, toAddress, amount) {
  const amountDash = amount / (1000 * 100000000);
  console.log(
    `\tWithdrawing ${amount} credits (${amountDash} DASH) to ${toAddress}`,
  );

  // Temporarily force minRelay to have a value so withdrawal succeeds
  // https://github.com/dashpay/platform/issues/2233
  // eslint-disable-next-line no-param-reassign
  client.wallet.storage.getDefaultChainStore().state.fees.minRelay = 1000;

  const response = await client.platform.identities.withdrawCredits(
    identity,
    amount,
    {
      toAddress,
    },
  );
  // console.log(response);
  return client.platform.identities.get(identity.toJSON().id);
}

module.exports.withdrawCredits = withdrawCredits;
