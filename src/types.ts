// Copyright 2023 Parity Technologies (UK) Ltd.

import type { AnyJson } from '@polkadot/types/types';

export type TokenRegistry = {
	polkadot: ChainInfo;
	kusama: ChainInfo;
	westend: ChainInfo;
};

export type ChainInfo = {
	[key: string]: {
		assetsInfo: AssetsInfo;
		specName: string;
		foreignAssetsInfo: ForeignAssetsInfo;
		poolPairsInfo: PoolPairsInfo;
		xcAssetsData?: SanitizedXcAssetsData[];
	};
};

export type PoolPairsInfo = {
	[key: string]: {
		lpToken: string;
		pairInfo: string;
	};
};

export type ChainName = 'polkadot' | 'kusama' | 'westend';

export type ForeignAssetMetadata = {
	deposit: string;
	name: string;
	symbol: string;
	decimals: string;
	isFrozen: boolean;
};

export interface AssetsInfo {
	[key: string]: string;
}

export interface ForeignAssetsInfo {
	[key: string]: {
		symbol: string;
		name: string;
		multiLocation: string;
	};
}

export interface PoolInfo {
	lpToken: string;
}

export interface ParaIds {
	[key: string]: number[];
}

export type XcAssets = {
	polkadot: XcAssetsInfo[];
	kusama: XcAssetsInfo[];
};

export type XcAssetsInfo = {
	relayChain: string;
	paraID: number;
	id: string;
	xcAssetCnt: string;
	data: XcAssetsData[];
};

export type XcAssetsData = {
	paraID: number;
	relayChain: string;
	nativeChainId: string;
	symbol: string;
	decimals: number;
	interiorType: string;
	xcmV1Standardized: XcAssetXcmStandardized[];
	xcmV1MultiLocationByte: boolean;
	xcmV1MultiLocation: AnyJson;
	asset: { ForeignAsset: string } | string;
	source: string[];
};

export type SanitizedXcAssetsData = {
	paraID: number;
	nativeChainId: string;
	symbol: string;
	decimals: number;
	xcmV1MultiLocation: string;
	asset: { ForeignAsset: string } | string;
};

export type XcAssetXcmStandardized = {
	[x: string]: string | number;
};
