/* eslint-disable no-underscore-dangle, max-len */
const chai = require('chai');

const ContractMetadata = require('../../../test/data/contract_metadata');
const Decoder = require('../decoder');

const { assert, expect } = chai;

describe('Decoder', () => {
  describe('toBCSAddress()', () => {
    it('returns the converted qtum address', () => {
      assert.equal(
        Decoder.toBCSAddress('17e7888aa7412a735f336d2f6d784caefabb6fa3', false),
        'B6dUXM8WjS9fF6UianfP5vQDtu7ZSzuB2z',
      );
      assert.equal(
        Decoder.toBCSAddress('2a2ad24849bc061f0f7abee243ebdb584b0d11f1', true),
        'B8J3J4EHk4SrSE1nV1sdtFHT18ciGEg19J',
      );
    });

    it('throws if hexAddress is undefined or empty', () => {
      expect(() => Decoder.toBCSAddress()).to.throw();
      expect(() => Decoder.toBCSAddress('')).to.throw();
    });

    it('throws if hexAddress is not hex', () => {
      expect(() => Decoder.toBCSAddress('B6dUXM8WjS9fF6UianfP5vQDtu7ZSzuB2z')).to.throw();
    });
  });

  describe('removeHexPrefix()', () => {
    it('returns the value without the hex prefix', () => {
      const hexValue = '0x1111111111111111111111111111111111111111';
      assert.equal(Decoder.removeHexPrefix(hexValue), hexValue.slice(2));
    });

    it('returns the array values with hex prefixes', () => {
      const hexArray = ['0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222'];
      const expected = [hexArray[0].slice(2), hexArray[1].slice(2)];
      assert.deepEqual(Decoder.removeHexPrefix(hexArray), expected);
    });
  });

  describe('decodeCall()', () => {
    let rawOutput = {
      address: 'a6dd0b0399dc6162cedde85ed50c6fa4a0dd44f1',
      executionResult: {
        gasUsed: 21720,
        excepted: 'None',
        newAddress: 'a6dd0b0399dc6162cedde85ed50c6fa4a0dd44f1',
        output: '000000000000000000000000000000000000000000000000002386f26fc10000',
        codeDeposit: 0,
        gasRefunded: 0,
        depositSize: 0,
        gasForDeposit: 0,
      },
      transactionReceipt: {
        stateRoot: 'e6dfdcb1a7b722f39cf036d681ff76637f556447a8dea0d29f05b83df82d9cc0',
        gasUsed: 21720,
        bloom: '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
        log: [],
      },
    };

    it('returns the formattedOutput in the object', () => {
      const decoded = Decoder.decodeCall(rawOutput, ContractMetadata.BodhiToken.abi, 'tokenTotalSupply');
      assert.isDefined(decoded.executionResult.formattedOutput);
    });

    it('returns the formatted call output for a struct', () => {
      rawOutput = {
        address: 'dacd16bde8ff9f7689cb8d3363324c77fbb80950',
        executionResult: {
          gasUsed: 22381,
          excepted: 'None',
          newAddress: 'dacd16bde8ff9f7689cb8d3363324c77fbb80950',
          output: '00000000000000000000000000000000000000000000000000000000000000010000000000000000000000009ece13d31f24b1c45107924f9c3fda2eb55eeda7',
          codeDeposit: 0,
          gasRefunded: 0,
          depositSize: 0,
          gasForDeposit: 0,
        },
        transactionReceipt: {
          stateRoot: 'c0886d5ea7204e8f2e6006d5847c8fb6813b0430322476443630f367f50b6a82',
          gasUsed: 22381,
          bloom: '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
          log: [
          ],
        },
      };

      const decoded = Decoder.decodeCall(rawOutput, ContractMetadata.TopicEvent.abi, 'oracles', true);
      assert.equal(decoded.executionResult.formattedOutput.oracleAddress, '9ece13d31f24b1c45107924f9c3fda2eb55eeda7');
      assert.isTrue(decoded.executionResult.formattedOutput.didSetResult);
    });

    it('returns the formatted call output for uint', () => {
      rawOutput = {
        address: 'dacd16bde8ff9f7689cb8d3363324c77fbb80950',
        executionResult: {
          gasUsed: 22303,
          excepted: 'None',
          newAddress: 'dacd16bde8ff9f7689cb8d3363324c77fbb80950',
          output: '0000000000000000000000000000000000000000000000000000000000000004',
          codeDeposit: 0,
          gasRefunded: 0,
          depositSize: 0,
          gasForDeposit: 0,
        },
        transactionReceipt: {
          stateRoot: 'c0886d5ea7204e8f2e6006d5847c8fb6813b0430322476443630f367f50b6a82',
          gasUsed: 22303,
          bloom: '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
          log: [
          ],
        },
      };

      const decoded = Decoder.decodeCall(rawOutput, ContractMetadata.TopicEvent.abi, 'numOfResults', true);
      assert.equal(decoded.executionResult.formattedOutput[0], 4);
    });

    it('returns the formatted call output for address', () => {
      rawOutput = {
        address: 'dacd16bde8ff9f7689cb8d3363324c77fbb80950',
        executionResult: {
          gasUsed: 22169,
          excepted: 'None',
          newAddress: 'dacd16bde8ff9f7689cb8d3363324c77fbb80950',
          output: '00000000000000000000000017e7888aa7412a735f336d2f6d784caefabb6fa3',
          codeDeposit: 0,
          gasRefunded: 0,
          depositSize: 0,
          gasForDeposit: 0,
        },
        transactionReceipt: {
          stateRoot: 'c0886d5ea7204e8f2e6006d5847c8fb6813b0430322476443630f367f50b6a82',
          gasUsed: 22169,
          bloom: '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
          log: [
          ],
        },
      };

      const decoded = Decoder.decodeCall(rawOutput, ContractMetadata.TopicEvent.abi, 'owner', true);
      assert.equal(decoded.executionResult.formattedOutput[0], '17e7888aa7412a735f336d2f6d784caefabb6fa3');
    });

    it('throws if rawOutput, contractABI, or methodName is undefined', () => {
      expect(() => Decoder.decodeCall(undefined, ContractMetadata.BodhiToken.abi, 'tokenTotalSupply')).to.throw();
      expect(() => Decoder.decodeCall(rawOutput, undefined, 'tokenTotalSupply')).to.throw();
      expect(() => Decoder.decodeCall(rawOutput, ContractMetadata.BodhiToken.abi, undefined)).to.throw();
    });
  });

  describe('decodeSearchLog()', () => {
    const rawOutput = [
      {
        blockHash: '1bfca6e1c401865982121000a60a5f7f32839e124486891fd2d34bd6e1052de2',
        blockNumber: 50344,
        transactionHash: '4c24f818a41c5c4288f5ca288a21477063c67df055946bb54650efad288add56',
        transactionIndex: 2,
        from: '17e7888aa7412a735f336d2f6d784caefabb6fa3',
        to: 'd53927df927be7fc51ce8bf8b998cb6611c266b0',
        cumulativeGasUsed: 3409568,
        gasUsed: 3409568,
        contractAddress: 'd53927df927be7fc51ce8bf8b998cb6611c266b0',
        log: [
          {
            address: '6d5b0ec97475e8d854efddc81d3a1d0f0f019669',
            topics: [
              'c46e722c8158268af789d6a68206785f8d497869da236f87c2014c1c08fd3dec',
              '0000000000000000000000009697b1f2701ca9434132723ee790d1cb0ab0e414',
              '00000000000000000000000017e7888aa7412a735f336d2f6d784caefabb6fa3',
              '000000000000000000000000a51f3252ff700df157b4633d1fa563fbcbe6e8fd',
            ],
            data: '4265737420646f6720746f206f776e3f00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000426561676c6500000000000000000000000000000000000000000000000000004875736b79000000000000000000000000000000000000000000000000000000476f6c64656e205265747269657665720000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000c4a9000000000000000000000000000000000000000000000000000000000000c4e000000000000000000000000000000000000000000000000000000002540be400',
          },
          {
            address: 'd53927df927be7fc51ce8bf8b998cb6611c266b0',
            topics: [
              'b7fa6f4e0c226cf0645f9f983dbc0bb4bb971400b98fae2387487d6d810c9c56',
              '000000000000000000000000a51f3252ff700df157b4633d1fa563fbcbe6e8fd',
              '00000000000000000000000017e7888aa7412a735f336d2f6d784caefabb6fa3',
              '00000000000000000000000017e7888aa7412a735f336d2f6d784caefabb6fa3',
            ],
            data: '4265737420646f6720746f206f776e3f00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000426561676c6500000000000000000000000000000000000000000000000000004875736b79000000000000000000000000000000000000000000000000000000476f6c64656e20526574726965766572000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c4a9000000000000000000000000000000000000000000000000000000000000c4e0',
          },
        ],
      },
    ];

    it('returns the formatted searchlog output', () => {
      const formatted = Decoder.decodeSearchLog(rawOutput, ContractMetadata, true);

      // CentralizedOracleCreated event
      const log0 = formatted[0].log[0];
      assert.equal(log0._eventName, 'CentralizedOracleCreated');
      assert.equal(log0._contractAddress, '9697b1f2701ca9434132723ee790d1cb0ab0e414');
      assert.equal(log0._oracle, '17e7888aa7412a735f336d2f6d784caefabb6fa3');
      assert.equal(log0._eventAddress, 'a51f3252ff700df157b4633d1fa563fbcbe6e8fd');

      const name = [
        '4265737420646f6720746f206f776e3f00000000000000000000000000000000',
        '0000000000000000000000000000000000000000000000000000000000000000',
        '0000000000000000000000000000000000000000000000000000000000000000',
        '0000000000000000000000000000000000000000000000000000000000000000',
        '0000000000000000000000000000000000000000000000000000000000000000',
        '0000000000000000000000000000000000000000000000000000000000000000',
        '0000000000000000000000000000000000000000000000000000000000000000',
        '0000000000000000000000000000000000000000000000000000000000000000',
        '0000000000000000000000000000000000000000000000000000000000000000',
        '0000000000000000000000000000000000000000000000000000000000000000',
      ];
      assert.deepEqual(log0._name, name);

      const resultNames = [
        '426561676c650000000000000000000000000000000000000000000000000000',
        '4875736b79000000000000000000000000000000000000000000000000000000',
        '476f6c64656e2052657472696576657200000000000000000000000000000000',
        '0000000000000000000000000000000000000000000000000000000000000000',
        '0000000000000000000000000000000000000000000000000000000000000000',
        '0000000000000000000000000000000000000000000000000000000000000000',
        '0000000000000000000000000000000000000000000000000000000000000000',
        '0000000000000000000000000000000000000000000000000000000000000000',
        '0000000000000000000000000000000000000000000000000000000000000000',
        '0000000000000000000000000000000000000000000000000000000000000000',
      ];
      assert.deepEqual(log0._resultNames, resultNames);
      assert.equal(log0._numOfResults, 3);
      assert.equal(log0._bettingEndBlock, 0xc4a9);
      assert.equal(log0._resultSettingEndBlock, 0xc4e0);
      assert.equal(log0._consensusThreshold, 0x2540be400);

      // TopicCreated event
      const log1 = formatted[0].log[1];
      assert.equal(log1._eventName, 'TopicCreated');
      assert.equal(log1._topicAddress, 'a51f3252ff700df157b4633d1fa563fbcbe6e8fd');
      assert.equal(log1._creator, '17e7888aa7412a735f336d2f6d784caefabb6fa3');
      assert.equal(log1._oracle, '17e7888aa7412a735f336d2f6d784caefabb6fa3');
      assert.deepEqual(log1._name, name);
      assert.deepEqual(log1._resultNames, resultNames);
      assert.equal(log1._bettingEndBlock, 0xc4a9);
      assert.equal(log1._resultSettingEndBlock, 0xc4e0);
    });

    it('skips decoding for an invalid eventName', () => {
      const withdrawWinningsOutput = [
        {
          blockHash: 'b714317e141e29c9ccf7d051c55ba578cd1adf4239a968db0207673dfe911c66',
          blockNumber: 45038,
          transactionHash: '9ec8809f9d9ddd99011ab1fda176a6974d4839f298e299563844db37e008b41b',
          transactionIndex: 2,
          from: '17e7888aa7412a735f336d2f6d784caefabb6fa3',
          to: '979487ee8c643621d2e3950dbe60edc610d7569a',
          cumulativeGasUsed: 43666,
          gasUsed: 43666,
          contractAddress: '979487ee8c643621d2e3950dbe60edc610d7569a',
          log: [
            {
              address: 'f6177bc9812eeb531907621af6641a41133dea9e',
              topics: [
                '1234567890123456789012345678901234567890123456789012345678901234',
                '000000000000000000000000979487ee8c643621d2e3950dbe60edc610d7569a',
                '00000000000000000000000017e7888aa7412a735f336d2f6d784caefabb6fa3',
              ],
              data: '000000000000000000000000000000000000000000000000000000037e11d600',
            },
            {
              address: '979487ee8c643621d2e3950dbe60edc610d7569a',
              topics: [
                '64bd7c266edce1b240f0ed2697cdca2e2478fb1dbc18ec833f80cda28a34c029',
                '00000000000000000000000017e7888aa7412a735f336d2f6d784caefabb6fa3',
              ],
              data: '0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000037e11d600',
            },
          ],
        },
      ];

      const formatted = Decoder.decodeSearchLog(withdrawWinningsOutput, ContractMetadata, true);
      assert.isDefined(formatted[0].log[0].topics);
      assert.isDefined(formatted[0].log[0].data);
      assert.isDefined(formatted[0].log[1]._eventName);
      assert.isDefined(formatted[0].log[1]._winner);
      assert.isUndefined(formatted[0].log[1].topics);
      assert.isUndefined(formatted[0].log[1].data);
    });
  });
});
/* eslint-enable no-underscore-dangle, max-len */
