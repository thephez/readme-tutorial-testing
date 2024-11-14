/* eslint-disable operator-linebreak */
/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
const Dash = require('dash');
const { ExtendedDocument } = require('@dashevo/wasm-dpp/');
const { expect } = require('chai');
const dotenv = require('dotenv');
const testQueries = require('../queries/testQueries');
const goodNodes = require('./goodNodes');
const goodMainnetNodes = require('./goodMainnetNodes');

dotenv.config();
const network = process.env.NETWORK;
// const seedHost = 'seed-1.<devnet-name>.networks.dash.org';
// eslint-disable-next-line prefer-const
let selectedNode;
let documentId;
let identityId;
let identityName;
let startsWithString;

if (network === 'testnet') {
  selectedNode =
    goodNodes.goodNodes[Math.floor(Math.random() * goodNodes.goodNodes.length)];

  documentId = 'E8m6NCCnpschx4WRfk1uLMHqttqMJKPwYt8fWaVSJPrL'; // DPNS domain document ID for identityId
  identityId = 'GgZekwh38XcWQTyWWWvmw6CEYFnLU7yiZFPWZEjqKHit'; // Identity ID for an identityName (e.g. Tutorial-Test-000000)
  identityName = ['Tutorial-Test-000000', 'Tutorial-Test-000000-backup'];
  startsWithString = 'Tutorial-Test-';
} else if (network === 'mainnet') {
  selectedNode =
    goodMainnetNodes.goodMainnetNodes[
      Math.floor(Math.random() * goodMainnetNodes.goodMainnetNodes.length)
    ];

  documentId = 'CArf6mcv8oijKZAxSrAaVfGBo9euNbrhxKwdQfzhcuAR'; // DPNS domain document ID for identityId
  identityId = 'CJiTyM1AyXv1bZFWoAoEb9nHQZVW4rQNnPudQzayUWMt'; // Identity ID for an identityName (e.g. Tutorial-Test-000000)
  identityName = ['0x0000-0000-0000-0001'];
  startsWithString = '0x';
}

let sdkClient;
let limit = 1;

// selectedNode = '35.90.255.217:3000'; // devnet

describe(`Query Tests (${new Date().toLocaleTimeString()})`, function suite() {
  this.timeout(40000);

  before(function () {
    // console.log(`    Using node ${selectedNode} for tests`);
    sdkClient = new Dash.Client({
      network,
      // Uncomment for devnets
      // seeds: [{ host: seedHost }],
      dapiAddresses: [selectedNode],
    });
  });

  describe('Basic where queries', function () {
    it(`== - should return requested name - (${identityName[0]})`, async function () {
      const result = await testQueries.whereEqual(sdkClient, identityName[0]);
      // console.log(result[0].toObject());
      // console.log(result[0].getId().toString());
      // console.log(result[0].getData());

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.instanceOf(ExtendedDocument);
      expect(result[0].getData().label).to.be.equal(identityName[0]);
    });
  });

  describe('Query modifiers', function () {
    it(`startAt - should return names starting at document id - (${documentId})`, async function () {
      const result = await testQueries.startAt(sdkClient, documentId, limit);

      expect(result).to.have.lengthOf(limit);
      expect(result[0]).to.be.instanceOf(ExtendedDocument);
      // console.log(result)[0].toJSON())
      expect(result[0].getId().toString()).to.be.equal(documentId);
    });

    it(`startAtComplex (asc)- should return name(s) starting at document id - (${documentId})`, async function () {
      const result = await testQueries.startAtComplex(
        sdkClient,
        documentId,
        startsWithString,
        'asc',
        1,
      );

      expect(result).to.have.lengthOf.at.most(1);
      expect(result[0]).to.be.instanceOf(ExtendedDocument);
      expect(result[0].getId().toString()).to.be.equal(documentId);
    });

    it(`startAtComplex (desc)- should return name(s) starting at document id - (${documentId})`, async function () {
      const result = await testQueries.startAtComplex(
        sdkClient,
        documentId,
        startsWithString,
        'desc',
        1,
      );

      expect(result).to.have.lengthOf.at.most(1);
      expect(result[0]).to.be.instanceOf(ExtendedDocument);
      expect(result[0].getId().toString()).to.be.equal(documentId);
    });

    it(`startAtComplex (asc)- should return name(s) starting at document id - (${documentId})`, async function () {
      limit = 2;
      const result = await testQueries.startAtComplex(
        sdkClient,
        documentId,
        startsWithString,
        'asc',
        limit,
      );

      expect(result).to.have.lengthOf.at.most(limit);
      expect(result[0]).to.be.instanceOf(ExtendedDocument);
      expect(result[0].getId().toString()).to.be.equal(documentId);
    });

    it(`startAtComplex (desc)- should return name(s) starting at document id - (${documentId})`, async function () {
      limit = 2;
      const result = await testQueries.startAtComplex(
        sdkClient,
        documentId,
        startsWithString,
        'desc',
        limit,
      );

      expect(result).to.have.lengthOf.at.most(limit);
      expect(result[0]).to.be.instanceOf(ExtendedDocument);
      expect(result[0].getId().toString()).to.be.equal(documentId);
    });

    it(`startAfter - should return names starting after document id - (${documentId})`, async function () {
      const result = await testQueries.startAfter(sdkClient, documentId);

      // console.log(`\tReceived document with id: ${result[0].getId().toString()}`);
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.instanceOf(ExtendedDocument);
      expect(result[0].getId().toString()).to.not.be.equal(documentId);
    });
  });

  describe('Where - comparison operators', function () {
    it(`< id (desc) - should return name starting before id - (${identityId})`, async function () {
      const result = await testQueries.whereLessThanId(
        sdkClient,
        identityId,
        'desc',
      );

      console.log(
        `\tReceived document with name/id: ${
          result[0].getData().label
        } ${result[0].getOwnerId().toString()}`,
      );
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.instanceOf(ExtendedDocument);
      expect(result[0].getId().toString()).to.not.be.equal(documentId);
    });

    it(`< id (asc) - should return name starting before id - (${identityId})`, async function () {
      const result = await testQueries.whereLessThanId(
        sdkClient,
        identityId,
        'asc',
      );

      console.log(
        `\tReceived document with name/id: ${
          result[0].getData().label
        } ${result[0].getOwnerId().toString()}`,
      );
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.instanceOf(ExtendedDocument);
      expect(result[0].getId().toString()).to.not.be.equal(documentId);
    });

    it(`<= id (desc) - should return previous names starting with id - (${identityId})`, async function () {
      const result = await testQueries.whereLessThanEqualToId(
        sdkClient,
        identityId,
        'desc',
      );

      console.log(
        `\tReceived document with name/id: ${
          result[0].getData().label
        } ${result[0].getOwnerId().toString()}`,
      );
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.instanceOf(ExtendedDocument);
      expect(result[0].getId().toString()).to.be.equal(documentId);
    });

    it(`<= id (asc) - should return previous names starting with id - (${identityId})`, async function () {
      const result = await testQueries.whereLessThanEqualToId(
        sdkClient,
        identityId,
        'asc',
      );

      console.log(
        `\tReceived document with name/id: ${
          result[0].getData().label
        } ${result[0].getOwnerId().toString()}`,
      );
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.instanceOf(ExtendedDocument);
      expect(result[0].getId().toString()).to.not.be.equal(documentId);
    });

    it(`> id (desc) - should return name starting after id - (${identityId})`, async function () {
      const result = await testQueries.whereGreaterThanId(
        sdkClient,
        identityId,
        'desc',
      );

      console.log(
        `\tReceived document with name/id: ${
          result[0].getData().label
        } ${result[0].getOwnerId().toString()}`,
      );
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.instanceOf(ExtendedDocument);
      expect(result[0].getId().toString()).to.not.be.equal(documentId);
    });

    it(`> id (asc) - should return name starting after id - (${identityId})`, async function () {
      const result = await testQueries.whereGreaterThanId(
        sdkClient,
        identityId,
        'asc',
      );

      console.log(
        `\tReceived document with name/id: ${
          result[0].getData().label
        } ${result[0].getOwnerId().toString()}`,
      );
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.instanceOf(ExtendedDocument);
      expect(result[0].getId().toString()).to.not.be.equal(documentId);
    });

    it(`>= (desc) - should return names starting with id - (${identityId})`, async function () {
      const result = await testQueries.whereGreaterThanEqualToId(
        sdkClient,
        identityId,
        'desc',
      );

      console.log(
        `\tReceived document with name/id: ${
          result[0].getData().label
        } ${result[0].getOwnerId().toString()}`,
      );
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.instanceOf(ExtendedDocument);
      expect(result[0].getId().toString()).to.not.be.equal(documentId);
    });

    it(`>= (asc) - should return names starting with id - (${identityId})`, async function () {
      const result = await testQueries.whereGreaterThanEqualToId(
        sdkClient,
        identityId,
        'asc',
        2, // So both regular and backup name are retrieved
      );

      console.log(
        `\tReceived document with name/id: ${
          result[0].getData().label
        } ${result[0].getOwnerId().toString()}`,
      );
      expect(result).to.have.lengthOf(2);
      expect(result[0]).to.be.instanceOf(ExtendedDocument);
      // eslint-disable-next-line no-unused-expressions
      expect(result.some((item) => item.getId().toString() === documentId)).to
        .be.true;
    });

    it(`in (asc) - should return all existing names from list (all do exist) - (${identityName})`, async function () {
      const result = await testQueries.whereIn(
        sdkClient,
        identityName,
        'asc',
        5,
      );

      const names = [];
      let match = false;
      // eslint-disable-next-line no-restricted-syntax
      for (const r of result) {
        names.push(r.getData().label);
        if (r.getId().toString() === documentId) {
          match = true;
        }
      }

      console.log(`\tReceived document with name(s): ${names}`);
      expect(result).to.have.lengthOf(identityName.length);
      expect(result[0]).to.be.instanceOf(ExtendedDocument);
      // eslint-disable-next-line no-unused-expressions
      expect(match).to.be.true;
    });

    it(`in (desc) - should return all existing names from list (all do exist) - (${identityName})`, async function () {
      const result = await testQueries.whereIn(
        sdkClient,
        identityName,
        'desc',
        5,
      );

      const names = [];
      let match = false;
      // eslint-disable-next-line no-restricted-syntax
      for (const r of result) {
        names.push(r.getData().label);
        if (r.getId().toString() === documentId) {
          match = true;
        }
      }

      console.log(`\tReceived document with name(s): ${names}`);
      expect(result).to.have.lengthOf(identityName.length);
      expect(result[0]).to.be.instanceOf(ExtendedDocument);
      // eslint-disable-next-line no-unused-expressions
      expect(match).to.be.true;
    });

    it('in (asc)- should return all existing names from list (some do not)', async function () {
      const someUnknownNames = [...identityName];
      someUnknownNames.push('somerandom_name');
      const result = await testQueries.whereIn(
        sdkClient,
        someUnknownNames,
        'asc',
        5,
      );

      const names = [];
      let match = false;
      // eslint-disable-next-line no-restricted-syntax
      for (const r of result) {
        names.push(r.getData().label);
        if (r.getId().toString() === documentId) {
          match = true;
        }
      }

      console.log(`\tReceived document with name: ${names}`);
      expect(result).to.have.lengthOf(identityName.length);
      // expect(result[0]).to.be.instanceOf(Document);
      // eslint-disable-next-line no-unused-expressions
      expect(match).to.be.true;
    });

    it('in (desc)- should return all existing names from list (some do not)', async function () {
      const someUnknownNames = [...identityName];
      someUnknownNames.push('somerandom_name');
      const result = await testQueries.whereIn(
        sdkClient,
        someUnknownNames,
        'desc',
        5,
      );

      const names = [];
      let match = false;
      // eslint-disable-next-line no-restricted-syntax
      for (const r of result) {
        names.push(r.getData().label);
        if (r.getId().toString() === documentId) {
          match = true;
        }
      }

      console.log(`\tReceived document with name: ${names}`);
      expect(result).to.have.lengthOf(identityName.length);
      expect(result[0]).to.be.instanceOf(ExtendedDocument);
      // eslint-disable-next-line no-unused-expressions
      expect(match).to.be.true;
    });
  });

  describe('Where - evaluation operators', function () {
    it(`startsWith (asc) - should return name starting with provide string - (${startsWithString})`, async function () {
      const result = await testQueries.whereStartsWith(
        sdkClient,
        startsWithString,
        'asc',
      );

      console.log(
        `\tReceived document with name: ${result[0].getData().label}`,
      );
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.instanceOf(ExtendedDocument);
      expect(
        result[0].getData().label.slice(0, startsWithString.length),
      ).to.be.equal(startsWithString);
    });

    it(`startsWith (desc) - should return name starting with provide string - (${startsWithString})`, async function () {
      const result = await testQueries.whereStartsWith(
        sdkClient,
        startsWithString,
        'desc',
      );

      console.log(
        `\tReceived document with name: ${result[0].getData().label}`,
      );
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.instanceOf(ExtendedDocument);
      expect(
        result[0].getData().label.slice(0, startsWithString.length),
      ).to.be.equal(startsWithString);
    });

    after(function () {
      sdkClient.disconnect();
    });
  });
});
