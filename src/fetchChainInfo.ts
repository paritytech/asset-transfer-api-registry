// Copyright 2023 Parity Technologies (UK) Ltd.

import type { EndpointOption } from '@polkadot/apps-config/endpoints/types';

import { fetchSystemParachainAssetConversionPoolInfo } from './fetchSystemParachainAssetConversionPoolInfo';
import { fetchSystemParachainAssetInfo } from './fetchSystemParachainAssetInfo';
import { fetchSystemParachainForeignAssetInfo } from './fetchSystemParachainForeignAssetInfo';
import { getApi } from './getApi';
import type {
	AssetsInfo,
	ChainInfoKeys,
	ForeignAssetsInfo,
	PoolPairsInfo,
} from './types';
import { logWithDate } from './util';

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
	isRelay?: boolean,
): Promise<ChainInfoKeys | null> => {
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
			foreignAssetsInfo = await fetchSystemParachainForeignAssetInfo(api);
			poolPairsInfo = await fetchSystemParachainAssetConversionPoolInfo(api);
		}

		await api.disconnect();

		return {
			tokens,
			assetsInfo,
			foreignAssetsInfo,
			poolPairsInfo,
			specName: specNameStr,
		};
	} else {
		return null;
	}
};
