// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';

import type { AssetsInfo } from './types';

/**
 * Fetch Asset info for system parachains.
 *
 * @param api
 */
export const fetchSystemParachainAssetInfo = async (
	api: ApiPromise,
): Promise<AssetsInfo> => {
	const assetsInfo: AssetsInfo = {};

	for (const [assetStorageKeyData] of await api.query.assets.asset.entries()) {
		const id = assetStorageKeyData
			.toHuman()
			?.toString()
			.trim()
			.replace(/,/g, '');

		if (id) {
			const assetMetadata = await api.query.assets.metadata(id);
			const assetSymbol = assetMetadata.symbol.toHuman()?.toString();

			if (assetSymbol) {
				assetsInfo[id] = assetSymbol;
			}
		}
	}

	return assetsInfo;
};
