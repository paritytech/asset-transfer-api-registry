// Copyright 2024 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';
import { EndpointOption } from '@polkadot/apps-config/endpoints/types.js';

import FinalRegistry from '../docs/registry.json' assert { type: 'json' };
import { ASSET_HUB_SPEC_NAMES } from './consts.js';
import { fetchSystemParachainAssetConversionPoolInfo } from './fetchSystemParachainAssetConversionPoolInfo.js';
import { fetchSystemParachainAssetInfo } from './fetchSystemParachainAssetInfo.js';
import { fetchSystemParachainForeignAssetInfo } from './fetchSystemParachainForeignAssetInfo.js';
import { getApi } from './getApi.js';
import type {
	AssetsInfo,
	ChainInfoKeys,
	ForeignAssetsInfo,
	PoolPairsInfo,
	SanitizedXcAssetsData,
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

		if (ASSET_HUB_SPEC_NAMES.includes(specNameStr)) {
			assetsInfo = await fetchSystemParachainAssetInfo(api);
			foreignAssetsInfo = await fetchSystemParachainForeignAssetInfo(
				api,
				paraId,
			);
			poolPairsInfo = await fetchSystemParachainAssetConversionPoolInfo(api);
		}

		const xcAssets = await updateChainInfoWithUsdtAsset(api, paraId);

		await api.disconnect();

		return [
			{
				tokens,
				assetsInfo,
				foreignAssetsInfo,
				poolPairsInfo,
				specName: specNameStr,
				...(xcAssets && xcAssets.length != 0 ? { xcAssetsData: xcAssets } : {}),
			},
			endpointOpts.paraId,
		];
	} else {
		return null;
	}
};

const updateChainInfoWithUsdtAsset = async (
	api: ApiPromise,
	paraId: number,
): Promise<SanitizedXcAssetsData[] | undefined> => {
	if (!api?.call?.xcmPaymentApi) return;

	const chainInfoRegistry = FinalRegistry.polkadot[paraId] as ChainInfoKeys;

	// Check if USDT or USDC are already in xcAssetsData
	if (
		chainInfoRegistry?.xcAssetsData?.some((item) =>
			/usdt|usdc/i.test(item.symbol),
		)
	) {
		return;
	}

	// USDT Location
	const usdtXcmPath =
		'{"v3":{"concrete":{"parents":1,"interior":{"x3":[{"parachain":1000},{"palletInstance":50},{"generalIndex":1984}]}}}}';
	// USDC Location
	const usdcXcmPath =
		'{"v3":{"concrete":{"parents":1,"interior":{"x3":[{"parachain":1000},{"palletInstance":50},{"generalIndex":1337}]}}}}';

	const xcAssets: SanitizedXcAssetsData[] = [];
	// Check acceptable payment assets
	try {
		const paymentAssetsV3 =
			await api.call.xcmPaymentApi.queryAcceptablePaymentAssets(3);
		const paymentAssetsJson = JSON.parse(JSON.stringify(paymentAssetsV3)) as {
			ok: string[];
		};
		const assetDict: Record<string, string> = {
			[usdtXcmPath]: 'USDT',
			[usdcXcmPath]: 'USDC',
		};
		// Check if USDT or USDC are one of the acceptable payment assets
		for (const item of paymentAssetsJson.ok) {
			if (
				JSON.stringify(item) == usdtXcmPath ||
				JSON.stringify(item) == usdcXcmPath
			) {
				xcAssets.push({
					paraID: paraId,
					nativeChainID: 'asset-hub-polkadot',
					symbol: assetDict[JSON.stringify(item)],
					decimals: 6,
					xcmV1MultiLocation: usdcXcmPath,
					assetHubReserveLocation: '{"parents":"0","interior":{"Here":""}}',
				} as SanitizedXcAssetsData);
			}
		}
	} catch (error) {
		console.error(
			`Error fetching XCM payment assets for paraId ${paraId}:`,
			error,
		);
	}
	return xcAssets;
};
