// Copyright 2023 Parity Technologies (UK) Ltd.

import { XC_ASSET_CDN_URL } from './consts.js';
import { getAssetReserveLocations } from './getAssetReserveLocations.js';
import type {
	SanitizedXcAssetsData,
	TokenRegistry,
	XcAssets,
	XcAssetsData,
} from './types.js';
import { fetchXcAssetData } from './util.js';

export const fetchXcAssetsRegistryInfo = async (
	registry: TokenRegistry,
): Promise<TokenRegistry> => {
	const xcAssetsRegistry = await fetchXcAssetData(XC_ASSET_CDN_URL);
	const { xcAssets } = xcAssetsRegistry;

	assignXcAssetsToRelay(registry, xcAssets, 'polkadot');
	assignXcAssetsToRelay(registry, xcAssets, 'kusama');

	return registry;
};

const assignXcAssetsToRelay = (
	registry: TokenRegistry,
	xcAssets: XcAssets,
	chain: 'polkadot' | 'kusama',
): void => {
	const chainAssetInfo = xcAssets[chain];
	for (const paraInfo of chainAssetInfo) {
		const { paraID } = paraInfo;
		const para = registry[chain][paraID];

		if (para) {
			const sanitizedData = sanitizeXcAssetData(paraInfo.data, paraID);
			para['xcAssetsData'] = sanitizedData;
		}
	}
};

const sanitizeXcAssetData = (data: XcAssetsData[], chainId: number): SanitizedXcAssetsData[] => {
	const mappedData = data.map((info) => {
		return {
			paraID: info.paraID,
			nativeChainID: info.nativeChainID,
			symbol: info.symbol,
			decimals: info.decimals,
			xcmV1MultiLocation: JSON.stringify(info.xcmV1MultiLocation),
			asset: info.asset,
			reserveLocations: getAssetReserveLocations(
				info.xcmV1MultiLocation,
				chainId,
			),
		};
	});

	return mappedData;
};
