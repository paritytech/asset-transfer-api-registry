// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';

import type { PoolInfo, PoolPairsInfo, UnionXcmMultiLocation } from './types';

/**
 * Fetch asset conversion pool info from storage. This will return an object where
 * the keys are the token, and the objects within contain info about the token.
 *
 * @param api ApiPromise
 */
export const fetchSystemParachainAssetConversionPoolInfo = async (
	api: ApiPromise,
): Promise<PoolPairsInfo> => {
	const poolPairsInfo: PoolPairsInfo = {};

	if (api.query.assetConversion !== undefined) {
		for (const [
			poolKeyStorageData,
			PoolInfo,
		] of await api.query.assetConversion.pools.entries()) {
			const maybePoolData = poolKeyStorageData.toHuman();
			const maybePoolInfo = PoolInfo.toHuman();

			if (maybePoolData && maybePoolInfo) {
				// remove any commas from multilocation key values e.g. Parachain: 2,125 -> Parachain: 2125
				const poolAssetDataStr = JSON.stringify(maybePoolData).replace(
					/(\d),/g,
					'$1',
				);

				const palletAssetConversionNativeOrAssetIdData = JSON.parse(
					poolAssetDataStr,
				) as UnionXcmMultiLocation[][];

				const pool = maybePoolInfo as unknown as PoolInfo;

				poolPairsInfo[pool.lpToken] = {
					lpToken: pool.lpToken,
					pairInfo: JSON.stringify(palletAssetConversionNativeOrAssetIdData),
				};
			}
		}
	}

	return poolPairsInfo;
};
