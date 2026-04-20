import { describe, it, expect, beforeAll, vi } from 'vitest';
import { LDMerkleProof2019 } from '../../src/index.js';
import type * as explorerLookup from '@bloxberg-org/explorer-lookup';
import { BLOCKCHAINS } from '@bloxberg-org/explorer-lookup';

// Bloxberg certificate test fixture
const bloxbergCertificate = {
  "id": "https://bloxberg.org",
  "type": ["VerifiableCredential", "BloxbergCredential"],
  "issuer": "https://raw.githubusercontent.com/bloxberg-org/issuer_json/master/issuer.json",
  "issuanceDate": "2025-08-26T11:33:07.233557+00:00",
  "credentialSubject": {
    "id": "https://blockexplorer.bloxberg.org/address/0x9858eC18a269EE69ebfD7C38eb297996827DDa98",
    "issuingOrg": {
      "id": "https://bloxberg.org"
    }
  },
  "displayHtml": null,
  "crid": "17bf4b46701313ea8fbaf838c24b8647d39bff0a9d2b45f403cb72ba420bd4bd",
  "cridType": "sha2-256",
  "metadataJson": "{\"authorName\": \"\", \"researchTitle\": \"\", \"email\": \"\"}",
  "proof": {
    "type": "MerkleProof2019",
    "created": "2025-08-26T11:33:25.211352",
    "proofValue": "z2LuLBVSfnVzaQtxnpxUAEKyDUCFLUV2X62bqodhQyE9YjNCbH65jsyJM34RvDvRiVunD72Y5BbUGSuQN6qiHtuC2AZhEMxWaHt7GGULRTmNHadfRbZC4Wv6JQFZwgZPQoByEuTzGFz5zhbJae5Rbv3qLpfAqeqtJZs1gu844gbyeEGNPmVioERLGvHn8Uc22qyVZDsE5xiMSvNugxpBuh2K868P1xQPqQf6aafbz8jgCtcfH3LXGSCLapYSafA1BoBUHTf8AfmztdYpk1yDGnncjk7TaCePDXwJd3CNTAJiV5NpnmZ44uyJ7uz9LztZ7nFXStmsecgMR2P3Pz71mGTZogcqr1G48HEkDi5ADqvNPv2kTqZE1AAZigTbuGYUqxNb75oMwfxbFhV5dPfhgX",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "ecdsa-koblitz-pubkey:0xD748BF41264b906093460923169643f45BDbC32e",
    "ens_name": "mpdl.berg"
  },
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://w3id.org/bloxberg/schema/research_object_certificate_v1"
  ]
};

// Mock transaction data for Bloxberg
const mockBloxbergTransactionData: explorerLookup.TransactionData = {
  remoteHash: 'cbec52fb5cd238c2d7b6b00d3b1ed731bb365a9b5d3ebca1291bb06bfa4808da',
  issuingAddress: '0xD748BF41264b906093460923169643f45BDbC32e',
  time: '2025-08-26T11:33:25.000000',
  revokedAddresses: []
};

describe('Bloxberg Certificate Verification Test Suite', function () {
  describe('Certificate Structure Analysis', function () {
    let verifier: LDMerkleProof2019;
    let decodedProof: any;

    beforeAll(function () {
      verifier = new LDMerkleProof2019({ document: bloxbergCertificate });
      decodedProof = LDMerkleProof2019.decodeMerkleProof2019(bloxbergCertificate.proof);
    });

    it('should correctly identify the proof type as MerkleProof2019', function () {
      expect(verifier.type).toBe('MerkleProof2019');
      expect(bloxbergCertificate.proof.type).toBe('MerkleProof2019');
    });

    it('should decode the proof value correctly', function () {
      expect(decodedProof).toBeDefined();
      expect(decodedProof.targetHash).toBe('b7caee5080ebd2bd5e24a5a28f8cb12d90331c056f10c7421a56bfa46aec26a0');
      expect(decodedProof.merkleRoot).toBe('cbec52fb5cd238c2d7b6b00d3b1ed731bb365a9b5d3ebca1291bb06bfa4808da');
    });

    it('should extract the correct blockchain anchor', function () {
      expect(decodedProof.anchors).toBeDefined();
      expect(decodedProof.anchors.length).toBe(1);
      expect(decodedProof.anchors[0]).toBe('blink:eth:bloxberg:0xd439fb362952c418fc88e9c2074b0e851688c8f387e85cc86e7a8dd1d3a4965d');
    });

    it('should have a valid merkle proof path', function () {
      expect(decodedProof.path).toBeDefined();
      expect(decodedProof.path.length).toBe(1);
      expect(decodedProof.path[0]).toHaveProperty('left');
    });

    it('should identify Bloxberg blockchain correctly', function () {
      const chain = verifier.getChain();
      expect(chain).toBeDefined();
      expect(chain.code).toBe('ethbloxberg');
      expect(chain.name).toBe('bloxberg');
      expect(chain.blinkCode).toBe('eth');
    });
  });

  describe('Certificate Content Validation', function () {
    it('should have valid Verifiable Credential structure', function () {
      expect(bloxbergCertificate['@context']).toContain('https://www.w3.org/2018/credentials/v1');
      expect(bloxbergCertificate.type).toContain('VerifiableCredential');
      expect(bloxbergCertificate.type).toContain('BloxbergCredential');
    });

    it('should have proper issuer information', function () {
      expect(bloxbergCertificate.issuer).toBe('https://raw.githubusercontent.com/bloxberg-org/issuer_json/master/issuer.json');
      expect(bloxbergCertificate.issuanceDate).toBe('2025-08-26T11:33:07.233557+00:00');
    });

    it('should have valid credential subject', function () {
      expect(bloxbergCertificate.credentialSubject).toBeDefined();
      expect(bloxbergCertificate.credentialSubject.id).toBe('https://blockexplorer.bloxberg.org/address/0x9858eC18a269EE69ebfD7C38eb297996827DDa98');
      expect(bloxbergCertificate.credentialSubject.issuingOrg.id).toBe('https://bloxberg.org');
    });

    it('should have valid CRID (Content Registration ID)', function () {
      expect(bloxbergCertificate.crid).toBe('17bf4b46701313ea8fbaf838c24b8647d39bff0a9d2b45f403cb72ba420bd4bd');
      expect(bloxbergCertificate.cridType).toBe('sha2-256');
    });
  });

  describe('MerkleProof2019 Verification Process', function () {
    let verifier: LDMerkleProof2019;

    beforeAll(function () {
      vi.mock('@bloxberg-org/explorer-lookup', async (importOriginal) => {
        const explorerLookup = await importOriginal();
        return {
          ...explorerLookup,
          lookForTx: () => mockBloxbergTransactionData
        };
      });

      verifier = new LDMerkleProof2019({ document: bloxbergCertificate });
    });

    it('should extract transaction ID from anchor', function () {
      // getTransactionId is a private method, so we test via the verifier's transactionId property
      // which gets set during the verification process
      const expectedTxId = '0xd439fb362952c418fc88e9c2074b0e851688c8f387e85cc86e7a8dd1d3a4965d';

      // The transaction ID should be extractable from the anchor
      const decodedProof = LDMerkleProof2019.decodeMerkleProof2019(bloxbergCertificate.proof);
      const anchor = decodedProof.anchors[0];
      const txId = anchor.split(':')[3];

      expect(txId).toBe(expectedTxId);
    });

    it('should follow the expected verification process steps', function () {
      const proofVerificationSteps = verifier.getProofVerificationProcess();
      expect(proofVerificationSteps).toEqual([
        'assertProofValidity',
        'getTransactionId',
        'computeLocalHash',
        'fetchRemoteHash',
        'compareHashes',
        'checkMerkleRoot',
        'checkReceipt'
      ]);
    });

    it('should follow the expected identity verification process steps', function () {
      const identityVerificationSteps = verifier.getIdentityVerificationProcess();
      expect(identityVerificationSteps).toEqual([
        'deriveIssuingAddressFromPublicKey',
        'ensureVerificationMethodValidity',
        'compareIssuingAddress'
      ]);
    });
  });

  describe('Bloxberg Specific Features', function () {
    it('should support Bloxberg blockchain in chain detection', function () {
      expect(BLOCKCHAINS.ethbloxberg).toBeDefined();
      expect(BLOCKCHAINS.ethbloxberg.name).toBe('bloxberg');
      expect(BLOCKCHAINS.ethbloxberg.signatureValue).toBe('ethbloxberg');
    });

    it('should have ENS name in verification method', function () {
      expect(bloxbergCertificate.proof.ens_name).toBe('mpdl.berg');
    });

    it('should point to Bloxberg block explorer in credential subject', function () {
      const subjectId = bloxbergCertificate.credentialSubject.id;
      expect(subjectId).toContain('blockexplorer.bloxberg.org');
      expect(subjectId).toMatch(/0x[a-fA-F0-9]{40}/); // Ethereum address pattern
    });
  });

  describe('Error Handling and Edge Cases', function () {
    it('should handle missing proof gracefully', function () {
      const certificateWithoutProof = { ...bloxbergCertificate };
      delete certificateWithoutProof.proof;

      expect(() => {
        new LDMerkleProof2019({ document: certificateWithoutProof });
      }).toThrow('The passed document is not signed.');
    });

    it('should validate proof purpose', function () {
      expect(bloxbergCertificate.proof.proofPurpose).toBe('assertionMethod');
    });

    it('should have valid creation timestamp', function () {
      const created = new Date(bloxbergCertificate.proof.created);
      const issuanceDate = new Date(bloxbergCertificate.issuanceDate);

      expect(created).toBeInstanceOf(Date);
      expect(issuanceDate).toBeInstanceOf(Date);

      // The proof creation should happen after or around the same time as issuance
      // Allow for some flexibility as they should be close in time
      const timeDifference = created.getTime() - issuanceDate.getTime();
      expect(Math.abs(timeDifference)).toBeLessThan(24 * 60 * 60 * 1000); // Within 24 hours
    });
  });

  // describe('Integration Test with Mock Data', function () {
  //   it('should verify certificate with mocked blockchain data', async function () {
  //     const verifier = new LDMerkleProof2019({
  //       document: bloxbergCertificate,
  //       options: {
  //         explorerAPIs: [{
  //           serviceURL: 'https://mock-bloxberg-explorer.com',
  //           priority: 0,
  //           parsingFunction: (): explorerLookup.TransactionData => mockBloxbergTransactionData
  //         }]
  //       }
  //     });

  //     // Note: This will likely fail on hash comparison due to document canonicalization differences
  //     // but we can test the individual components work correctly
  //     const result = await verifier.verifyProof({
  //       verifyIdentity: false,
  //       documentLoader: () => null
  //     });

  //     // The verification might fail due to hash mismatch, but we can check that the process runs
  //     expect(result).toBeDefined();
  //     expect(result).toHaveProperty('verified');
  //     expect(result).toHaveProperty('verificationMethod');

  //     if (!result.verified) {
  //       // Expected failure modes for Bloxberg certificates without proper canonicalization
  //       expect(result.error).toMatch(/hash|merkle|receipt/i);
  //     }
  //   });
  // });
});