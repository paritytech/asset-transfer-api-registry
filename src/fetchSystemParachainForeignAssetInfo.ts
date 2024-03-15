// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';
import { stringToHex } from '@polkadot/util';

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
): Promise<ForeignAssetsInfo> => {
	const foreignAssetsInfo: ForeignAssetsInfo = {};

	if (api.query.foreignAssets !== undefined) {
		const assetEntries = await api.query.foreignAssets.asset.entries();

		for (const [assetStorageKeyData] of assetEntries) {
			const foreignAssetData = assetStorageKeyData.toHuman();

			if (foreignAssetData) {
				// remove any commas from multilocation key values e.g. Parachain: 2,125 -> Parachain: 2125
				const foreignAssetMultiLocationStr = JSON.stringify(
					foreignAssetData[0],
				).replace(/(\d),/g, '$1');

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
					foreignAssetsInfo[foreignAssetInfoKey] = {
						symbol: assetSymbol,
						name: assetName,
						multiLocation: JSON.stringify(foreignAssetMultiLocation),
					};
				}
			}
		}
	}

	return foreignAssetsInfo;
};
