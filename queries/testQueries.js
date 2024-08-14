/* eslint-disable no-console */
const {
  PlatformProtocol: { Identifier },
} = require('dash');

/**
 * @param {string} input
 * @return {string}
 */
function convertToHomographSafeChars(input) {
  return input.toLowerCase().replace(/[oli]/g, (match) => {
    if (match === 'o') {
      return '0';
    }

    if (match === 'l' || match === 'i') {
      return '1';
    }

    return match;
  });
}

async function startAt(sdkClient, startAtId, limit = 1) {
  return sdkClient.platform.documents.get('dpns.domain', {
    limit,
    startAt: Buffer.from(Identifier.from(startAtId)),
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
      ['normalizedLabel', 'startsWith', convertToHomographSafeChars(startsWithString)],
    ],
    orderBy: [['normalizedLabel', orderByDirection]],
  });
}

async function startAfter(sdkClient, startAfterId, limit = 1) {
  return sdkClient.platform.documents.get('dpns.domain', {
    limit,
    startAfter: Buffer.from(Identifier.from(startAfterId)),
  });
}

async function whereEqual(sdkClient, dpnsName) {
  const normalizedLabel = convertToHomographSafeChars(dpnsName);
  return sdkClient.platform.documents.get('dpns.domain', {
    where: [
      ['normalizedParentDomainName', '==', 'dash'],
      ['normalizedLabel', '==', normalizedLabel],
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
    where: [['records.identity', '<', id]],
    orderBy: [['records.identity', orderByDirection]],
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
    where: [['records.identity', '<=', id]],
    orderBy: [['records.identity', orderByDirection]],
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
    where: [['records.identity', '>', id]],
    orderBy: [['records.identity', orderByDirection]],
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
    where: [['records.identity', '>=', id]],
    orderBy: [['records.identity', orderByDirection]],
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
      ['normalizedLabel', 'in', dpnsNames.map((name) => convertToHomographSafeChars(name))],
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
      ['normalizedLabel', 'startsWith', convertToHomographSafeChars(startsWithName)],
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
