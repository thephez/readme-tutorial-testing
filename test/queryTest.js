/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
const Dash = require('dash');
const Document = require('@dashevo/dpp/lib/document/Document');
const { expect } = require('chai');
const dotenv = require('dotenv');
const testQueries = require('../tutorials/query/testQueries');

dotenv.config();
// const network = 'testnet';
const network = 'devnet';
const seedHost = 'seed-1.krupnik.networks.dash.org';
const documentId = '4Qp3menV9QjE92hc3BzkUCusAmHLxh1AU6gsVsPF4L2q';
const identityId = 'FETe2GxdRsAUj8Qoy3tsr6J822aupG5VYtetoYBgXt5P';
const identityName = ['RT-Jarret-33563', 'hashengineering'];
const startsWithString = 'RT-';

let sdkClient;
let limit = 1;

// selectedNode = '35.87.212.139:3000'; // devnet

describe(`Query Tests (${new Date().toLocaleTimeString()})`, function suite() {
  this.timeout(40000);

  before(function () {
    // console.log(`    Using node ${selectedNode} for tests`);
    sdkClient = new Dash.Client({
      network,
      seeds: [{ host: seedHost }],
      // dapiAddresses: [selectedNode],
    });
  });

  describe('Basic where queries', function () {
    it(`== - should return requested name - (${identityName[0]})`, async function () {
      const result = await testQueries.whereEqual(sdkClient, identityName[0]);
      // console.log(result[0])

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.instanceOf(Document);
      expect(result[0].getData().label).to.be.equal(identityName[0]);
    });
  });

  describe('Query modifiers', function () {
    it(`startAt - should return names starting at document id - (${documentId})`, async function () {
      const result = await testQueries.startAt(sdkClient, documentId, limit);

      expect(result).to.have.lengthOf(limit);
      expect(result[0]).to.be.instanceOf(Document);
      // console.log(result)[0].toJSON())
      expect(result[0].id.toJSON()).to.be.equal(documentId);
    });

    it(`startAtComplex (asc)- should return name(s) starting at document id - (${documentId})`, async function () {
      const result = await testQueries.startAtComplex(sdkClient, documentId, startsWithString, 'asc', 1);

      expect(result).to.have.lengthOf.at.most(1);
      expect(result[0]).to.be.instanceOf(Document);
      expect(result[0].id.toJSON()).to.be.equal(documentId);
    });

    // This test currently fails (returns all results, not just the limit requested)
    xit(`startAtComplex (desc)- should return name(s) starting at document id - (${documentId})`, async function () {
      const result = await testQueries.startAtComplex(sdkClient, documentId, startsWithString, 'desc', 1);

      expect(result).to.have.lengthOf.at.most(1);
      expect(result[0]).to.be.instanceOf(Document);
      expect(result[0].id.toJSON()).to.be.equal(documentId);
    });

    it(`startAtComplex (asc)- should return name(s) starting at document id - (${documentId})`, async function () {
      limit = 2;
      const result = await testQueries.startAtComplex(sdkClient, documentId, startsWithString, 'asc', limit);

      expect(result).to.have.lengthOf.at.most(limit);
      expect(result[0]).to.be.instanceOf(Document);
      expect(result[0].id.toJSON()).to.be.equal(documentId);
    });

    // This test currently fails (returns all results, not just the limit requested)
    xit(`startAtComplex (desc)- should return name(s) starting at document id - (${documentId})`, async function () {
      limit = 2;
      const result = await testQueries.startAtComplex(sdkClient, documentId, startsWithString, 'desc', limit);

      expect(result).to.have.lengthOf.at.most(limit);
      expect(result[0]).to.be.instanceOf(Document);
      expect(result[0].id.toJSON()).to.be.equal(documentId);
    });

    it(`startAfter - should return names starting after document id - (${documentId})`, async function () {
      const result = await testQueries.startAfter(sdkClient, documentId);

      // console.log(`\tReceived document with id: ${result[0].toJSON().$id}`);
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.instanceOf(Document);
      expect(result[0].id.toJSON()).to.not.be.equal(documentId);
    });
  });

  describe('Where - comparison operators', function () {
    it(`< id (desc) - should return name starting before id - (${identityId})`, async function () {
      const result = await testQueries.whereLessThanId(sdkClient, identityId, 'desc');

      console.log(`\tReceived document with name/id: ${result[0].toJSON().label} ${result[0].toJSON().$ownerId}`);
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.instanceOf(Document);
      expect(result[0].id.toJSON()).to.not.be.equal(documentId);
    });

    // This test currently fails due to a bug? in Platform (https://github.com/dashevo/rs-drive/issues/83)
    xit(`< id (asc) - should return name starting before id - (${identityId})`, async function () {
      const result = await testQueries.whereLessThanId(sdkClient, identityId, 'asc');

      console.log(`\tReceived document with name/id: ${result[0].toJSON().label} ${result[0].toJSON().$ownerId}`);
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.instanceOf(Document);
      expect(result[0].id.toJSON()).to.not.be.equal(documentId);
    });

    it(`<= id (desc) - should return previous names starting with id - (${identityId})`, async function () {
      const result = await testQueries.whereLessThanEqualToId(sdkClient, identityId, 'desc');

      console.log(`\tReceived document with name/id: ${result[0].toJSON().label} ${result[0].toJSON().$ownerId}`);
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.instanceOf(Document);
      expect(result[0].id.toJSON()).to.be.equal(documentId);
    });

    // This test currently fails due to a bug? in Platform (https://github.com/dashevo/rs-drive/issues/83)
    xit(`<= id (asc) - should return previous names starting with id - (${identityId})`, async function () {
      const result = await testQueries.whereLessThanEqualToId(sdkClient, identityId, 'asc');

      console.log(`\tReceived document with name/id: ${result[0].toJSON().label} ${result[0].toJSON().$ownerId}`);
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.instanceOf(Document);
      expect(result[0].id.toJSON()).to.not.be.equal(documentId);
    });

    it(`> id (desc) - should return name starting after id - (${identityId})`, async function () {
      const result = await testQueries.whereGreaterThanId(sdkClient, identityId, 'desc');

      console.log(`\tReceived document with name/id: ${result[0].toJSON().label} ${result[0].toJSON().$ownerId}`);
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.instanceOf(Document);
      expect(result[0].id.toJSON()).to.not.be.equal(documentId);
    });

    // This test currently fails due to a bug? in Platform (https://github.com/dashevo/rs-drive/issues/83)
    it(`> id (asc) - should return name starting after id - (${identityId})`, async function () {
      const result = await testQueries.whereGreaterThanId(sdkClient, identityId, 'asc');

      console.log(`\tReceived document with name/id: ${result[0].toJSON().label} ${result[0].toJSON().$ownerId}`);
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.instanceOf(Document);
      expect(result[0].id.toJSON()).to.not.be.equal(documentId);
    });

    it(`>= (desc) - should return names starting with id - (${identityId})`, async function () {
      const result = await testQueries.whereGreaterThanEqualToId(sdkClient, identityId, 'desc');

      console.log(`\tReceived document with name/id: ${result[0].toJSON().label} ${result[0].toJSON().$ownerId}`);
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.instanceOf(Document);
      expect(result[0].id.toJSON()).to.not.be.equal(documentId);
    });

    // This test currently fails due to a bug? in Platform (https://github.com/dashevo/rs-drive/issues/83)
    it(`>= (asc) - should return names starting with id - (${identityId})`, async function () {
      const result = await testQueries.whereGreaterThanEqualToId(sdkClient, identityId, 'asc');

      console.log(`\tReceived document with name/id: ${result[0].toJSON().label} ${result[0].toJSON().$ownerId}`);
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.instanceOf(Document);
      expect(result[0].id.toJSON()).to.be.equal(documentId);
    });

    it(`in (asc) - should return all existing names from list (all do exist) - (${identityName})`, async function () {
      const result = await testQueries.whereIn(sdkClient, identityName, 'asc', 5);

      const names = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const r of result) {
        names.push(r.getData().label);
      }

      // console.log(`\tReceived document with name(s): ${names}`);
      expect(result).to.have.lengthOf(identityName.length);
      expect(result[0]).to.be.instanceOf(Document);
      expect(result[0].id.toJSON()).to.not.be.equal(documentId);
    });

    it(`in (desc) - should return all existing names from list (all do exist) - (${identityName})`, async function () {
      const result = await testQueries.whereIn(sdkClient, identityName, 'desc', 5);

      const names = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const r of result) {
        names.push(r.getData().label);
      }

      // console.log(`\tReceived document with name(s): ${names}`);
      expect(result).to.have.lengthOf(identityName.length);
      expect(result[0]).to.be.instanceOf(Document);
      expect(result[0].id.toJSON()).to.be.equal(documentId);
    });

    // This test currently fails due to a bug in Platform (https://github.com/dashevo/grovedb/pull/80/)
    xit('in (asc)- should return all existing names from list (some do not)', async function () {
      const someBadNames = [...identityName];
      someBadNames.push('somerandom_name');
      const result = await testQueries.whereIn(sdkClient, someBadNames, 'asc', 5);

      const names = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const r of result) {
        names.push(r.getData().label);
      }

      console.log(`\tReceived document with name: ${names}`);
      expect(result).to.have.lengthOf(identityName.length);
      expect(result[0]).to.be.instanceOf(Document);
      expect(result[0].id.toJSON()).to.not.be.equal(documentId);
    });

    // This test currently fails due to a bug in Platform (https://github.com/dashevo/grovedb/pull/80/)
    xit('in (desc)- should return all existing names from list (some do not)', async function () {
      const someBadNames = [...identityName];
      someBadNames.push('somerandom_name');
      const result = await testQueries.whereIn(sdkClient, someBadNames, 'desc', 5);

      const names = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const r of result) {
        names.push(r.getData().label);
      }

      console.log(`\tReceived document with name: ${names}`);
      expect(result).to.have.lengthOf(identityName.length);
      expect(result[0]).to.be.instanceOf(Document);
      expect(result[0].id.toJSON()).to.not.be.equal(documentId);
    });
  });
});

describe('Where - evaluation operators', function () {
  it(`startsWith (asc) - should return name starting with provide string - (${startsWithString})`, async function () {
    const result = await testQueries.whereStartsWith(sdkClient, startsWithString, 'asc');

    console.log(`\tReceived document with name: ${result[0].toJSON().label}`);
    expect(result).to.have.lengthOf(1);
    expect(result[0]).to.be.instanceOf(Document);
    expect(result[0].id.toJSON()).to.not.be.equal(documentId);
  });

  it(`startsWith (desc) - should return name starting with provide string - (${startsWithString})`, async function () {
    const result = await testQueries.whereStartsWith(sdkClient, startsWithString, 'desc');

    console.log(`\tReceived document with name: ${result[0].toJSON().label}`);
    expect(result).to.have.lengthOf(1);
    expect(result[0]).to.be.instanceOf(Document);
    expect(result[0].id.toJSON()).to.not.be.equal(documentId);
  });

  after(function () {
    sdkClient.disconnect();
  });
});
