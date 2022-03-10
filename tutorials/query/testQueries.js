/* eslint-disable no-console */
const Identifier = require('@dashevo/dpp/lib/Identifier');

async function startAt(sdkClient, startAtId) {
  return sdkClient.platform.documents.get(
    'dpns.domain',
    {
      limit: 1,
      startAt: Buffer.from(Identifier.from(startAtId)),
    // where: [
    //   ['normalizedParentDomainName', '==', 'dash'],
    //   ['normalizedLabel', 'startsWith', 'RT-'.toLowerCase()],
    // ],
    // orderBy: [
    //   ['normalizedLabel', 'asc'],
    // ],
    },
  );
}

async function startAfter(sdkClient, startAfterId, limit = 1) {
  return sdkClient.platform.documents.get(
    'dpns.domain',
    {
      limit,
      startAfter: Buffer.from(Identifier.from(startAfterId)),
    },
  );
}

async function whereSimple(sdkClient, dpnsName) {
  return sdkClient.platform.documents.get(
    'dpns.domain',
    {
      where: [
        ['normalizedParentDomainName', '==', 'dash'],
        ['normalizedLabel', '==', dpnsName.toLowerCase()],
      ],
    },
  );
}

async function whereLessThanId(sdkClient, id, orderByDirection = 'asc', limit = 1) {
  return sdkClient.platform.documents.get(
    'dpns.domain',
    {
      limit,
      where: [
        ['records.dashUniqueIdentityId', '<', id],
      ],
      orderBy: [
        ['records.dashUniqueIdentityId', orderByDirection],
      ],
    },
  );
}

async function whereLessThanEqualToId(sdkClient, id, orderByDirection = 'asc', limit = 1) {
  return sdkClient.platform.documents.get(
    'dpns.domain',
    {
      limit,
      where: [
        ['records.dashUniqueIdentityId', '<=', id],
      ],
      orderBy: [
        ['records.dashUniqueIdentityId', orderByDirection],
      ],
    },
  );
}

async function whereGreaterThanId(sdkClient, id, orderByDirection = 'asc', limit = 1) {
  return sdkClient.platform.documents.get(
    'dpns.domain',
    {
      limit,
      where: [
        ['records.dashUniqueIdentityId', '>', id],
      ],
      orderBy: [
        ['records.dashUniqueIdentityId', orderByDirection],
      ],
    },
  );
}

async function whereGreaterThanEqualToId(sdkClient, id, orderByDirection = 'asc', limit = 1) {
  return sdkClient.platform.documents.get(
    'dpns.domain',
    {
      limit,
      where: [
        ['records.dashUniqueIdentityId', '>=', id],
      ],
      orderBy: [
        ['records.dashUniqueIdentityId', orderByDirection],
      ],
    },
  );
}

async function whereIn(sdkClient, dpnsNames, orderByDirection = 'asc', limit = 1) {
  // console.log(dpnsNames.map(name => name.toLowerCase()))
  return sdkClient.platform.documents.get(
    'dpns.domain',
    {
      limit,
      where: [
        ['normalizedParentDomainName', '==', 'dash'],
        ['normalizedLabel', 'in', dpnsNames.map((name) => name.toLowerCase())],
      ],
      orderBy: [
        ['normalizedLabel', orderByDirection],
      ],
    },
  );
}

async function whereStartsWith(sdkClient, startsWithName, orderByDirection = 'asc', limit = 1) {
  return sdkClient.platform.documents.get(
    'dpns.domain',
    {
      limit,
      where: [
        ['normalizedParentDomainName', '==', 'dash'],
        ['normalizedLabel', 'startsWith', startsWithName.toLowerCase()],
      ],
      orderBy: [
        ['normalizedLabel', orderByDirection],
      ],
    },
  );
}

module.exports = {
  startAt,
  startAfter,
  whereSimple,
  whereLessThanId,
  whereLessThanEqualToId,
  whereGreaterThanId,
  whereGreaterThanEqualToId,
  whereIn,
  whereStartsWith,
};
