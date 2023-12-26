// Copyright 2023 Parity Technologies (UK) Ltd.

import path from 'path';

import type { TokenRegistry } from './types';

/**
 * @const MAX_RETRIES Maximum amount of connection attempts
 * @const WS_DISCONNECT_TIMEOUT_SECONDS time to wait between attempts, in seconds
 * @const RCP_BLACK_LIST RPCs emitting errors or abnormal closures
 */
export const MAX_RETRIES = 5;
export const WS_DISCONNECT_TIMEOUT_SECONDS = 3;
export const XC_ASSET_CDN_URL =
	'https://cdn.jsdelivr.net/gh/colorfulnotion/xcm-global-registry/metadata/xcmgar.json';

export const RPC_BLACK_LIST = [
	'wss://polkadot-public-rpc.blockops.network/ws',
	'wss://kusama-public-rpc.blockops.network/ws',
	'wss://westend-rpc.blockops.network/ws',
];

export const DEFAULT_REGISTRY: TokenRegistry = {
	polkadot: {},
	kusama: {},
	westend: {},
	rococo: {},
};

export const PROD_REGISTRY_FILE_PATH = path.join(
	__dirname,
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
