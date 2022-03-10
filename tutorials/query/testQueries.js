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

async function startAfter(sdkClient, startAfterId) {
  return sdkClient.platform.documents.get(
    'dpns.domain',
    {
      limit: 1,
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

async function whereLessThanId(sdkClient, id, orderByDirection) {
  return sdkClient.platform.documents.get(
    'dpns.domain',
    {
      limit: 1,
      where: [
        ['records.dashUniqueIdentityId', '<', id],
      ],
      orderBy: [
        ['records.dashUniqueIdentityId', orderByDirection],
      ],
    },
  );
}

async function whereLessThanEqualToId(sdkClient, id, orderByDirection) {
  return sdkClient.platform.documents.get(
    'dpns.domain',
    {
      limit: 1,
      where: [
        ['records.dashUniqueIdentityId', '<=', id],
      ],
      orderBy: [
        ['records.dashUniqueIdentityId', orderByDirection],
      ],
    },
  );
}

async function whereGreaterThanId(sdkClient, id, orderByDirection) {
  return sdkClient.platform.documents.get(
    'dpns.domain',
    {
      limit: 1,
      where: [
        ['records.dashUniqueIdentityId', '>', id],
      ],
      orderBy: [
        ['records.dashUniqueIdentityId', orderByDirection],
      ],
    },
  );
}

async function whereGreaterThanEqualToId(sdkClient, id, orderByDirection) {
  return sdkClient.platform.documents.get(
    'dpns.domain',
    {
      limit: 1,
      where: [
        ['records.dashUniqueIdentityId', '>=', id],
      ],
      orderBy: [
        ['records.dashUniqueIdentityId', orderByDirection],
      ],
    },
  );
}

async function whereIn(sdkClient, dpnsNames) {
  // console.log(dpnsNames.map(name => name.toLowerCase()))
  return sdkClient.platform.documents.get(
    'dpns.domain',
    {
      limit: 5,
      where: [
        ['normalizedParentDomainName', '==', 'dash'],
        ['normalizedLabel', 'in', dpnsNames.map((name) => name.toLowerCase())],
      ],
      orderBy: [
        ['normalizedLabel', 'asc'],
      ],
    },
  );
}

async function whereStartsWith(sdkClient, startsWithName) {
  return sdkClient.platform.documents.get(
    'dpns.domain',
    {
      limit: 1,
      where: [
        ['normalizedParentDomainName', '==', 'dash'],
        ['normalizedLabel', 'startsWith', startsWithName.toLowerCase()],
      ],
      orderBy: [
        ['normalizedLabel', 'asc'],
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
