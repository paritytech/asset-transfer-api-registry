// Copyright 2024 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';
import { stringToHex } from '@polkadot/util';

import { getAssetReserveLocations } from './getAssetReserveLocations.js';
import type {
	ForeignAssetMetadata,
	ForeignAssetsInfo,
	UnionXcmMultiLocation,
} from './types.js';

/**
 * This will fetch all the foreign asset entries in storage and return an object
 * with each key as the id, and then the info as the nested keys.
 *
 * @param api ApiPromise
 */
export const fetchSystemParachainForeignAssetInfo = async (
	api: ApiPromise,
	chainId: number,
): Promise<ForeignAssetsInfo> => {
	const foreignAssetsInfo: ForeignAssetsInfo = {};

	if (api.query.foreignAssets !== undefined) {
		const assetEntries = await api.query.foreignAssets.asset.entries();

		let foreignAssetMultiLocationStr: string | undefined = undefined;
		for (const asset of assetEntries) {
			const storageKey = asset[0].toHuman();
			if (storageKey && Array.isArray(storageKey) && storageKey.length > 0) {
				foreignAssetMultiLocationStr = JSON.stringify(storageKey[0]).replace(
					/(\d),/g,
					'$1',
				);
			}
			if (!foreignAssetMultiLocationStr) {
				throw new Error('Unable to determine asset location');
			}

			const foreignAssetMultiLocation = JSON.parse(
				foreignAssetMultiLocationStr,
			) as UnionXcmMultiLocation;

			const hexId = stringToHex(JSON.stringify(foreignAssetMultiLocation));

			const assetMetadata = (
				await api.query.foreignAssets.metadata(foreignAssetMultiLocation)
			).toHuman();

			if (assetMetadata) {
				const metadata = assetMetadata as ForeignAssetMetadata;
				const assetSymbol = metadata.symbol;
				const assetName = metadata.name;

				// if the symbol exists in metadata use it, otherwise uses the hex of the multilocation as the key
				const foreignAssetInfoKey = assetSymbol ? assetSymbol : hexId;
				const assetLocation = JSON.stringify(foreignAssetMultiLocation);

				const [assetHubReserveLocation, originChainReserveLocation] =
					getAssetReserveLocations(assetLocation, chainId);

				foreignAssetsInfo[foreignAssetInfoKey] = {
					symbol: assetSymbol,
					name: assetName,
					multiLocation: assetLocation,
					assetHubReserveLocation,
					originChainReserveLocation,
				};
			}
		}
	}

	return foreignAssetsInfo;
};
