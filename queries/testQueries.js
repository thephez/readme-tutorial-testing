/* eslint-disable no-console */
const {
  PlatformProtocol: { Identifier },
} = require('dash');

async function startAt(sdkClient, startAtId, limit = 1) {
  return sdkClient.platform.documents.get('dpns.domain', {
    limit,
    startAt: Buffer.from(Identifier.from(startAtId)),
    where: [], // Temp fix for v0.25-dev.21
  });
}

async function startAtComplex(
  sdkClient,
  startAtId,
  startsWithString,
  orderByDirection = 'asc',
  limit = 1,
) {
  return sdkClient.platform.documents.get('dpns.domain', {
    limit,
    startAt: Buffer.from(Identifier.from(startAtId)),
    where: [
      ['normalizedParentDomainName', '==', 'dash'],
      ['normalizedLabel', 'startsWith', startsWithString.toLowerCase()],
    ],
    orderBy: [['normalizedLabel', orderByDirection]],
  });
}

async function startAfter(sdkClient, startAfterId, limit = 1) {
  return sdkClient.platform.documents.get('dpns.domain', {
    limit,
    startAfter: Buffer.from(Identifier.from(startAfterId)),
    where: [], // Temp fix for v0.25-dev.21
  });
}

async function whereEqual(sdkClient, dpnsName) {
  return sdkClient.platform.documents.get('dpns.domain', {
    where: [
      ['normalizedParentDomainName', '==', 'dash'],
      ['normalizedLabel', '==', dpnsName.toLowerCase()],
    ],
  });
}

async function whereLessThanId(
  sdkClient,
  id,
  orderByDirection = 'asc',
  limit = 1,
) {
  return sdkClient.platform.documents.get('dpns.domain', {
    limit,
    where: [['records.dashUniqueIdentityId', '<', id]],
    orderBy: [['records.dashUniqueIdentityId', orderByDirection]],
  });
}

async function whereLessThanEqualToId(
  sdkClient,
  id,
  orderByDirection = 'asc',
  limit = 1,
) {
  return sdkClient.platform.documents.get('dpns.domain', {
    limit,
    where: [['records.dashUniqueIdentityId', '<=', id]],
    orderBy: [['records.dashUniqueIdentityId', orderByDirection]],
  });
}

async function whereGreaterThanId(
  sdkClient,
  id,
  orderByDirection = 'asc',
  limit = 1,
) {
  return sdkClient.platform.documents.get('dpns.domain', {
    limit,
    where: [['records.dashUniqueIdentityId', '>', id]],
    orderBy: [['records.dashUniqueIdentityId', orderByDirection]],
  });
}

async function whereGreaterThanEqualToId(
  sdkClient,
  id,
  orderByDirection = 'asc',
  limit = 1,
) {
  return sdkClient.platform.documents.get('dpns.domain', {
    limit,
    where: [['records.dashUniqueIdentityId', '>=', id]],
    orderBy: [['records.dashUniqueIdentityId', orderByDirection]],
  });
}

async function whereIn(
  sdkClient,
  dpnsNames,
  orderByDirection = 'asc',
  limit = 1,
) {
  // console.log(dpnsNames.map(name => name.toLowerCase()))
  return sdkClient.platform.documents.get('dpns.domain', {
    limit,
    where: [
      ['normalizedParentDomainName', '==', 'dash'],
      ['normalizedLabel', 'in', dpnsNames.map((name) => name.toLowerCase())],
    ],
    orderBy: [['normalizedLabel', orderByDirection]],
  });
}

async function whereStartsWith(
  sdkClient,
  startsWithName,
  orderByDirection = 'asc',
  limit = 1,
) {
  return sdkClient.platform.documents.get('dpns.domain', {
    limit,
    where: [
      ['normalizedParentDomainName', '==', 'dash'],
      ['normalizedLabel', 'startsWith', startsWithName.toLowerCase()],
    ],
    orderBy: [['normalizedLabel', orderByDirection]],
  });
}

module.exports = {
  startAt,
  startAtComplex,
  startAfter,
  whereEqual,
  whereLessThanId,
  whereLessThanEqualToId,
  whereGreaterThanId,
  whereGreaterThanEqualToId,
  whereIn,
  whereStartsWith,
};
