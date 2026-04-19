import { describe, it, expect } from 'vitest';
import getChain from '../../src/helpers/getChain.js';
import { BLOCKCHAINS } from '@ignatkhar/explorer-lookup';

describe('Bloxberg Chain Detection Tests', function () {
  describe('getChain function', function () {
    it('should correctly identify Bloxberg chain from anchor', function () {
      const mockProof = {
        anchors: ['blink:eth:bloxberg:0xd439fb362952c418fc88e9c2074b0e851688c8f387e85cc86e7a8dd1d3a4965d'],
        targetHash: 'somehash',
        merkleRoot: 'someroot',
        path: []
      };

      const chain = getChain(mockProof);

      expect(chain).toBeDefined();
      expect(chain.code).toBe('ethbloxberg');
      expect(chain.name).toBe('bloxberg');
      expect(chain.blinkCode).toBe('eth');
      expect(chain.signatureValue).toBe('ethbloxberg');
    });

    it('should handle Ethereum mainnet anchors correctly', function () {
      const mockProof = {
        anchors: ['blink:eth:mainnet:0x1234567890abcdef'],
        targetHash: 'somehash',
        merkleRoot: 'someroot',
        path: []
      };

      const chain = getChain(mockProof);

      expect(chain).toBeDefined();
      expect(chain.code).toBe('ethmain');
      expect(chain.signatureValue).toBe('ethereumMainnet');
    });

    it('should handle Ethereum Sepolia testnet anchors correctly', function () {
      const mockProof = {
        anchors: ['blink:eth:sepolia:0x1234567890abcdef'],
        targetHash: 'somehash',
        merkleRoot: 'someroot',
        path: []
      };

      const chain = getChain(mockProof);

      expect(chain).toBeDefined();
      expect(chain.code).toBe('ethsepolia');
      expect(chain.signatureValue).toBe('ethereumSepolia');
    });

    it('should return null for invalid or missing proof', function () {
      expect(getChain(null)).toBe(null);
      expect(getChain({})).toBe(null);
      expect(getChain({ anchors: [] })).toBe(null);
    });

    it('should throw error for unsupported chain codes', function () {
      const mockProof = {
        anchors: ['blink:unsupported:network:0x1234567890abcdef'],
        targetHash: 'somehash',
        merkleRoot: 'someroot',
        path: []
      };

      expect(() => getChain(mockProof)).toThrow('Could not retrieve chain.');
    });
  });

  describe('BLOCKCHAINS configuration', function () {
    it('should have Bloxberg blockchain properly configured', function () {
      expect(BLOCKCHAINS.ethbloxberg).toBeDefined();

      const bloxberg = BLOCKCHAINS.ethbloxberg;
      expect(bloxberg.code).toBe('ethbloxberg');
      expect(bloxberg.name).toBe('bloxberg');
      expect(bloxberg.blinkCode).toBe('eth');
      expect(bloxberg.signatureValue).toBe('ethbloxberg');
      expect(bloxberg.test).toBe(false); // Should be production network
    });
  });

  describe('Anchor format validation', function () {
    it('should parse Bloxberg anchor format correctly', function () {
      const anchor = 'blink:eth:bloxberg:0xd439fb362952c418fc88e9c2074b0e851688c8f387e85cc86e7a8dd1d3a4965d';
      const parts = anchor.split(':');

      expect(parts).toHaveLength(4);
      expect(parts[0]).toBe('blink');
      expect(parts[1]).toBe('eth');
      expect(parts[2]).toBe('bloxberg');
      expect(parts[3]).toBe('0xd439fb362952c418fc88e9c2074b0e851688c8f387e85cc86e7a8dd1d3a4965d');
      expect(parts[3]).toMatch(/^0x[a-fA-F0-9]{64}$/); // 64-char hex transaction hash
    });

    it('should handle different Ethereum network anchors', function () {
      const testCases = [
        { anchor: 'blink:eth:mainnet:0x123', expectedNetwork: 'mainnet' },
        { anchor: 'blink:eth:sepolia:0x456', expectedNetwork: 'sepolia' },
        { anchor: 'blink:eth:goerli:0x789', expectedNetwork: 'goerli' },
        { anchor: 'blink:eth:bloxberg:0xabc', expectedNetwork: 'bloxberg' }
      ];

      testCases.forEach(({ anchor, expectedNetwork }) => {
        const parts = anchor.split(':');
        expect(parts[2]).toBe(expectedNetwork);
      });
    });
  });
});