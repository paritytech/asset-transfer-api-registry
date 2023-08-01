// Copyright 2023 Parity Technologies (UK) Ltd.

export type TokenRegistry = {
	polkadot: {};
	kusama: {};
	westend: {};
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
