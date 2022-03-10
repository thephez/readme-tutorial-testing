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
const network = 'testnet';
const documentId = '4Qp3menV9QjE92hc3BzkUCusAmHLxh1AU6gsVsPF4L2q';
const identityName = ['RT-Jarret-33563', 'hashengineering'];
const startsWithString = 'RT-';

let sdkClient;

selectedNode = '35.87.212.139:3000'; // devnet

describe(`Query Tests (${new Date().toLocaleTimeString()})`, function suite() {
  this.timeout(40000);

  describe('Initial preparation', function () {
    before(function () {
      console.log(`\tUsing node ${selectedNode} for tests`);
      sdkClient = new Dash.Client({
        network,
        // seeds: [{ host: process.env.SEED }],
        dapiAddresses: [selectedNode],
      });
    });

    it(`startAt - should return names starting at document id - (${documentId})`, async function () {
      const result = await testQueries.startAt(sdkClient, documentId);

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.instanceOf(Document);
      // console.log(result[0].toJSON())
      expect(result[0].id.toJSON()).to.be.equal(documentId);
    });

    it(`startAfter - should return names starting after document id - (${documentId})`, async function () {
      const result = await testQueries.startAfter(sdkClient, documentId);

      console.log(`\tReceived document with id: ${result[0].toJSON().$id}`);
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.instanceOf(Document);
      expect(result[0].id.toJSON()).to.not.be.equal(documentId);
    });

    it(`where - should return requested name with simple where query - (${identityName[0]})`, async function () {
      const result = await testQueries.whereSimple(sdkClient, identityName[0]);
      // console.log(result[0])

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.instanceOf(Document);
      expect(result[0].getData().label).to.be.equal(identityName[0]);
    });

    xit(`whereLessThan - should return names starting before name - (${identityName[0]})`, async function () {
      const result = await testQueries.whereLessThan(sdkClient, identityName[0]);

      console.log(`\tReceived document with name: ${result[0].toJSON().label}`);
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.instanceOf(Document);
      expect(result[0].id.toJSON()).to.not.be.equal(documentId);
    });

    it(`whereIn - should return all names from list where they all exist - (${identityName})`, async function () {
      const result = await testQueries.whereIn(sdkClient, identityName);

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

    // This test currently fails due to bug in Platform
    xit('whereIn - should return all names that exist where some do not exist', async function () {
      const someBadNames = [...identityName];
      someBadNames.push('somerandom_name');
      const result = await testQueries.whereIn(sdkClient, someBadNames);

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

    it(`whereStartsWith - should return names starting with provide string - (${startsWithString})`, async function () {
      const result = await testQueries.whereStartsWith(sdkClient, startsWithString);

      console.log(`\tReceived document with name: ${result[0].toJSON().label}`);
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.instanceOf(Document);
      expect(result[0].id.toJSON()).to.not.be.equal(documentId);
    });

    after(function () {
      sdkClient.disconnect();
    });
  });
});
