// Copyright 2024 Parity Technologies (UK) Ltd.

import { EndpointOption } from '@polkadot/apps-config/endpoints/types.js';

import { fetchSystemParachainAssetConversionPoolInfo } from './fetchSystemParachainAssetConversionPoolInfo.js';
import { fetchSystemParachainAssetInfo } from './fetchSystemParachainAssetInfo.js';
import { fetchSystemParachainForeignAssetInfo } from './fetchSystemParachainForeignAssetInfo.js';
import { getApi } from './getApi.js';
import type {
	AssetsInfo,
	ChainInfoKeys,
	ForeignAssetsInfo,
	PoolPairsInfo,
} from './types.js';
import { logWithDate } from './util.js';

/**
 * Fetch chain token and spec info.
 *
 * @param endpointOpts
 * @param chain
 * @param isRelay
 */
export const fetchChainInfo = async (
	endpointOpts: EndpointOption,
	chain: string,
	isRelay: boolean,
	paraId: number,
): Promise<[ChainInfoKeys, number | undefined] | null> => {
	const api = await getApi(endpointOpts, chain, isRelay);

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
			foreignAssetsInfo = await fetchSystemParachainForeignAssetInfo(
				api,
				paraId,
			);
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
