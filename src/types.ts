// Copyright 2023 Parity Technologies (UK) Ltd.

import type { AnyJson } from '@polkadot/types/types';

export type TokenRegistry = {
	polkadot: ChainInfo;
	kusama: ChainInfo;
	westend: ChainInfo;
	rococo: ChainInfo;
};

export type ChainInfoKeys = {
	tokens: string[];
	assetsInfo: AssetsInfo;
	specName: string;
	foreignAssetsInfo: ForeignAssetsInfo;
	poolPairsInfo: PoolPairsInfo;
	xcAssetsData?: SanitizedXcAssetsData[];
};

export type ChainInfo = {
	[key: string]: ChainInfoKeys;
};

export type PoolPairsInfo = {
	[key: string]: {
		lpToken: string;
		pairInfo: string;
	};
};

export type ChainName = 'polkadot' | 'kusama' | 'westend' | 'rococo';

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
		assetHubReserveLocation: string;
		originChainReserveLocation?: string;
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
	nativeChainID: string | null;
	symbol: string;
	decimals: number;
	interiorType: string;
	xcmV1Standardized: (XcAssetXcmStandardized | string)[];
	xcmV1MultiLocation: AnyJson;
	asset: Object | string;
	source: string[];
	xcmV1MultiLocationByte?: `0x${string}`;
};

export type SanitizedXcAssetsData = {
	paraID: number;
	nativeChainID: string | null;
	symbol: string;
	decimals: number;
	xcmV1MultiLocation: string;
	asset: Object | string;
	assetHubReserveLocation: string;
	originChainReserveLocation?: string | undefined;
};

export type XcAssetXcmStandardized = {
	[x: string]: string | number | undefined;
};

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
	T,
	Exclude<keyof T, Keys>
> &
	{
		[K in Keys]-?: Required<Pick<T, K>> &
			Partial<Record<Exclude<Keys, K>, undefined>>;
	}[Keys];

export type XcmV2MultiLocation = {
	parents: number;
	interior: RequireOnlyOne<XcmV2Junctions>;
};

export interface XcmV2Junctions {
	Here: '' | null;
	X1: XcmV2Junction;
	X2: [XcmV2Junction, XcmV2Junction];
	X3: [XcmV2Junction, XcmV2Junction, XcmV2Junction];
	X4: [XcmV2Junction, XcmV2Junction, XcmV2Junction, XcmV2Junction];
	X5: [
		XcmV2Junction,
		XcmV2Junction,
		XcmV2Junction,
		XcmV2Junction,
		XcmV2Junction,
	];
	X6: [
		XcmV2Junction,
		XcmV2Junction,
		XcmV2Junction,
		XcmV2Junction,
		XcmV2Junction,
		XcmV2Junction,
	];
	X7: [
		XcmV2Junction,
		XcmV2Junction,
		XcmV2Junction,
		XcmV2Junction,
		XcmV2Junction,
		XcmV2Junction,
		XcmV2Junction,
	];
	X8: [
		XcmV2Junction,
		XcmV2Junction,
		XcmV2Junction,
		XcmV2Junction,
		XcmV2Junction,
		XcmV2Junction,
		XcmV2Junction,
		XcmV2Junction,
	];
}

export type XcmV2Junction = RequireOnlyOne<XcmV2JunctionBase>;

export type XcmV2JunctionBase = {
	Parachain: number | string;
	AccountId32: { network?: XcmV2Network; id: string };
	AccountIndex64: { network?: XcmV2Network; id: string };
	AccountKey20: { network?: XcmV2Network; id: string };
	PalletInstance: number | string;
	GeneralIndex: string | number;
	GeneralKey: string;
	OnlyChild: AnyJson;
	Plurality: { id: AnyJson; part: AnyJson };
};

export type XcmV2Network = string | null;

export type XcmV3MultiLocation = {
	parents: number;
	interior: RequireOnlyOne<XcmV3Junctions>;
};

export interface XcmV3Junctions {
	Here: '' | null;
	X1: XcmV3Junction;
	X2: [XcmV3Junction, XcmV3Junction];
	X3: [XcmV3Junction, XcmV3Junction, XcmV3Junction];
	X4: [XcmV3Junction, XcmV3Junction, XcmV3Junction, XcmV3Junction];
	X5: [
		XcmV3Junction,
		XcmV3Junction,
		XcmV3Junction,
		XcmV3Junction,
		XcmV3Junction,
	];
	X6: [
		XcmV3Junction,
		XcmV3Junction,
		XcmV3Junction,
		XcmV3Junction,
		XcmV3Junction,
		XcmV3Junction,
	];
	X7: [
		XcmV3Junction,
		XcmV3Junction,
		XcmV3Junction,
		XcmV3Junction,
		XcmV3Junction,
		XcmV3Junction,
		XcmV3Junction,
	];
	X8: [
		XcmV3Junction,
		XcmV3Junction,
		XcmV3Junction,
		XcmV3Junction,
		XcmV3Junction,
		XcmV3Junction,
		XcmV3Junction,
		XcmV3Junction,
	];
}

export type XcmV3Junction = RequireOnlyOne<XcmV3JunctionBase>;

export type XcmV3JunctionBase = {
	Parachain: number;
	AccountId32: { network?: XcmV2Network; id: string };
	AccountIndex64: { network?: XcmV2Network; id: string };
	AccountKey20: { network?: XcmV2Network; id: string };
	PalletInstance: number;
	GeneralIndex: string | number;
	GeneralKey: string;
	OnlyChild: AnyJson;
	Plurality: { id: AnyJson; part: AnyJson };
	GlobalConsensus: string | AnyJson;
};

export type UnionXcmMultiLocation = XcmV3MultiLocation | XcmV2MultiLocation;

export type UnionXcmMultiAssets = XcmV2MultiAssets | XcmV3MultiAssets;

export type UnionXcmMultiAsset = XcmV2MultiAsset | XcmV3MultiAsset;

export type UnionXcAssetsMultiAssets =
	| XcAssetsV2MultiAssets
	| XcAssetsV3MultiAssets;

export type UnionXcAssetsMultiAsset =
	| XcAssetsV2MultiAsset
	| XcAssetsV3MultiAsset;

export interface XcmMultiAsset {
	id: {
		Concrete: UnionXcmMultiLocation;
	};
	fun: {
		Fungible: string;
	};
}

export interface XcmV2MultiAssets {
	V2: XcmMultiAsset[];
}

export interface XcmV3MultiAssets {
	V3: XcmMultiAsset[];
}

export interface XcmV2MultiAsset {
	V2: XcmMultiAsset;
}

export interface XcmV3MultiAsset {
	V3: XcmMultiAsset;
}

export interface XcAssetsV2MultiAssets {
	V2: FungibleObjMultiAsset[];
}

export interface XcAssetsV3MultiAssets {
	V3: FungibleObjMultiAsset[];
}

export interface XcAssetsV2MultiAsset {
	V2: FungibleObjMultiAsset;
}

export interface XcAssetsV3MultiAsset {
	V3: FungibleObjMultiAsset;
}

export type FungibleStrMultiAsset = {
	fun: {
		Fungible: string;
	};
	id: {
		Concrete: UnionXcmMultiLocation;
	};
};

export type FungibleObjMultiAsset = {
	fun: {
		Fungible: { Fungible: string };
	};
	id: {
		Concrete: UnionXcmMultiLocation;
	};
};

export type UnionXcAssetsMultiLocation =
	| XcAssetsV2MultiLocation
	| XcAssetsV3MultiLocation;

export interface XcAssetsV2MultiLocation {
	V2: {
		id: {
			Concrete: XcmV2MultiLocation;
		};
	};
}

export interface XcAssetsV3MultiLocation {
	V3: {
		id: {
			Concrete: XcmV3MultiLocation;
		};
	};
}

export type AnyObj = { [x: string]: unknown };
