// Copyright 2023 Parity Technologies (UK) Ltd.

import path from 'path';
import { fileURLToPath } from 'url';

import type { TokenRegistry } from './types.js';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

/**
 * @const MAX_RETRIES Maximum amount of connection attempts
 * @const WS_DISCONNECT_TIMEOUT_SECONDS time to wait between attempts, in seconds
 * @const RCP_BLACK_LIST RPCs emitting errors or abnormal closures
 */
export const MAX_RETRIES = 5;
export const WS_DISCONNECT_TIMEOUT_SECONDS = 3;

export const RPC_BLACK_LIST = [
	'wss://polkadot-rpc.publicnode.com',
	'wss://api2.zondax.ch/pas/node/rpc',
	'wss://heiko-rpc.parallel.fi',
	'wss://public-01.mainnet.bifrostnetwork.com/wss',
	'wss://public-02.mainnet.bifrostnetwork.com/wss',
	'wss://polkadex.public.curie.radiumblock.co/ws',
	'wss://public-01.testnet.bifrostnetwork.com/wss',
	'wss://public-02.testnet.bifrostnetwork.com/wss',
	'wss://parachain-rpc.origin-trail.network',
	'wss://polkadot-parallel-rpc.parallel.fi',
	'wss://tinkernet-rpc.dwellir.com',
	'wss://khala.api.onfinality.io/public-ws',
	'wss://chainflip-rpc.dwellir.com',
	'wss://khala.public.curie.radiumblock.co/ws',
	'wss://polkadot-public-rpc.blockops.network/ws',
	'wss://kusama-public-rpc.blockops.network/ws',
	'wss://westend-rpc.blockops.network/ws',
	'wss://kreivo.kippu.rocks/',
	'wss://rpc-karura.luckyfriday.io',
	'wss://rpc-acala.luckyfriday.io',
	'wss://crab-rpc.darwiniacommunitydao.xyz',
	'wss://darwinia-rpc.darwiniacommunitydao.xyz',
];

export const DEFAULT_REGISTRY: TokenRegistry = {
	polkadot: {},
	kusama: {},
	westend: {},
	paseo: {},
};

export const PROD_REGISTRY_FILE_PATH = path.join(
	__dirname,
	'..',
	'..',
	'docs',
	'registry.json',
);
export const TEST_REGISTRY_FILE_PATH = path.join(
	__dirname,
	'..',
	'src',
	'testHelpers',
	'testRegistry.json',
);

export const ASSET_HUB_SPEC_NAMES = [
	'statemint',
	'statemine',
	'westmint',
	'asset-hub-polkadot',
	'asset-hub-kusama',
	'asset-hub-westend',
	'asset-hub-paseo',
];
