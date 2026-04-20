import { BLOCKCHAINS, type IBlockchainObject } from '@bloxberg-org/explorer-lookup';
import { capitalize } from '../utils/string.js';
import { type DecodedProof } from '../models/Proof';

// merkleRoot2019: see https://w3c-dvcg.github.io/lds-merkle-proof-2019/#blockchain-keymap
function getMerkleRoot2019Chain(anchor: string): IBlockchainObject {
  const dataArray = anchor.split(':');

  let mainChain: string;
  switch (dataArray[1]) {
    case BLOCKCHAINS.mocknet.blinkCode:
      return getChainObject(BLOCKCHAINS.mocknet.signatureValue);
    case BLOCKCHAINS.bitcoin.blinkCode:
      mainChain = BLOCKCHAINS.bitcoin.name;
      break;
    case BLOCKCHAINS.ethmain.blinkCode:
      mainChain = BLOCKCHAINS.ethmain.name;
      break;
    case 'arb':
      mainChain = 'Arbitrum';
      break;
    default:
      throw new Error('Could not retrieve chain.');
  }

  const network = dataArray[2];

  // Special handling for bloxberg which has signatureValue 'ethbloxberg'
  if (network === 'bloxberg' && mainChain === BLOCKCHAINS.ethmain.name) {
    return getChainObject('ethbloxberg');
  }

  // Special handling for Arbitrum chains
  if (mainChain === 'Arbitrum') {
    if (network === 'sepolia') {
      return getChainObject('arbitrumSepolia');
    } else if (network === 'one' || network === 'mainnet') {
      return getChainObject('arbitrumOne');
    } else if (network === 'bloxberg') {
      return getChainObject('arbbloxberg');
    }
  }

  const chainCodeSignatureValue = mainChain.toLowerCase() + capitalize(network);
  return getChainObject(chainCodeSignatureValue);
}

function getChainObject(chainCodeProofValue: string): IBlockchainObject {
  const chainObject: IBlockchainObject = Object.keys(BLOCKCHAINS)
    .map(key => BLOCKCHAINS[key])
    .find((entry: IBlockchainObject) => entry.signatureValue === chainCodeProofValue);
  return chainObject;
}

export default function getChain(proof: DecodedProof = null): IBlockchainObject {
  if (proof?.anchors) {
    const { anchors } = proof;
    const anchor = anchors[0];
    if (typeof anchor === 'string') {
      return getMerkleRoot2019Chain(anchor);
    }
  }

  return null;
}
