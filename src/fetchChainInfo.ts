// Copyright 2023 Parity Technologies (UK) Ltd.

// import type { EndpointOption } from '@polkadot/apps-config/endpoints/types';
import { ApiPromise } from '@polkadot/api';
import { EndpointOption } from '@polkadot/apps-config/endpoints/types.js';

import { fetchSystemParachainAssetConversionPoolInfo } from './fetchSystemParachainAssetConversionPoolInfo.js';
import { fetchSystemParachainAssetInfo } from './fetchSystemParachainAssetInfo.js';
import { fetchSystemParachainForeignAssetInfo } from './fetchSystemParachainForeignAssetInfo.js';
import type {
	AssetsInfo,
	ChainInfoKeys,
	ForeignAssetsInfo,
	PoolPairsInfo,
} from './types.js';
import { logWithDate } from './util.js';
import { getApi } from './getApi.js';

/**
 * Fetch chain token and spec info.
 *
 * @param endpointOpts
 * @param chain
 * @param isRelay
 */
export const fetchChainInfo = async (
	// api: ApiPromise | undefined | null,
	endpointOpts: EndpointOption,
	chain: string,
	isRelay: boolean
): Promise<[ChainInfoKeys, number | undefined] | null> => {
	if (chain === 'acala') {
		return null;
	}
	const api = await getApi(endpointOpts, chain, isRelay);

	// const chain = endpoint.info as unknown as string;
	const connected = api?.isConnected === true;
	logWithDate(`Api connected for ${chain}: ${connected}`, true);

	if (api !== null && api !== undefined) {
		const { tokenSymbol } = await api.rpc.system.properties();
		const { specName } = await api.rpc.state.getRuntimeVersion();
		const tokens: string[] = tokenSymbol.isSome
			? tokenSymbol
					.unwrap()
					.toArray()
					.map((token) => token.toString())
			: [];

		const specNameStr = specName.toString();

		let assetsInfo: AssetsInfo = {};
		let foreignAssetsInfo: ForeignAssetsInfo = {};
		let poolPairsInfo: PoolPairsInfo = {};

		if (
			specNameStr === 'westmint' ||
			specNameStr === 'asset-hub-westend' ||
			specNameStr === 'statemine' ||
			specNameStr === 'asset-hub-kusama' ||
			specNameStr === 'statemint' ||
			specNameStr === 'asset-hub-polkadot'
		) {
			assetsInfo = await fetchSystemParachainAssetInfo(api);
			foreignAssetsInfo = await fetchSystemParachainForeignAssetInfo(api);
			poolPairsInfo = await fetchSystemParachainAssetConversionPoolInfo(api);
		}

		await api.disconnect();

		return [
			{
				tokens,
				assetsInfo,
				foreignAssetsInfo,
				poolPairsInfo,
				specName: specNameStr,
			},
			endpointOpts.paraId,
		];
	} else {
		return null;
	}
};
