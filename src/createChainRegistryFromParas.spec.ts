// Copyright 2023 Parity Technologies (UK) Ltd.

import { prodParasKusamaCommon } from '@polkadot/apps-config';
import { EndpointOption } from '@polkadot/apps-config/endpoints/types';

import { DEFAULT_REGISTRY } from './consts.js';
import {
	appendFetchChainInfoPromise,
	createChainRegistryFromParas,
} from './createChainRegistryFromParas.js';
import { fetchParaIds } from './fetchParaIds.js';
import type { ChainName, ParaIds, TokenRegistry } from './types.js';
import { twirlTimer } from './util.js';

jest.mock('./util');
jest.mock('./createChainRegistryFromParas');
jest.mock('./fetchChainInfo');
jest.mock('./fetchParaIds');

const registry: TokenRegistry = DEFAULT_REGISTRY;

describe('CreateRegistryFromParas', () => {
	it('Should correctly add the registries for paras when found', async () => {
		(
			twirlTimer as jest.MockedFunction<() => NodeJS.Timeout>
		).mockReturnValueOnce(setTimeout(() => {}, 0));
		(
			appendFetchChainInfoPromise as jest.MockedFunction<
				(
					fetchChainInfoPromises: Promise<void>[],
					endpoint: EndpointOption,
					registry: TokenRegistry,
					chainName: ChainName,
				) => Promise<void>[]
			>
		)
			.mockReturnValueOnce([
				Promise.resolve({
					tokens: ['KSM'],
					assetsInfo: {},
					foreignAssetsInfo: {},
					poolPairsInfo: {},
					specName: 'statemine',
				}).then((res) => {
					registry['kusama']['1000'] = res;
				}),
			])
			.mockReturnValueOnce([
				Promise.resolve({
					tokens: ['KSM'],
					assetsInfo: {},
					foreignAssetsInfo: {},
					poolPairsInfo: {},
					specName: 'encointer-parachain',
				}).then((res) => {
					registry['kusama']['1001'] = res;
				}),
			])
			.mockReturnValueOnce([
				Promise.resolve({
					tokens: ['KSM'],
					assetsInfo: {},
					foreignAssetsInfo: {},
					poolPairsInfo: {},
					specName: 'bridge-hub-kusama',
				}).then((res) => {
					registry['kusama']['1002'] = res;
				}),
			]);

		const paraIds: ParaIds = { kusama: [1000, 1001, 1002] };
		(
			fetchParaIds as jest.MockedFunction<
				(
					chain: string,
					endpointOpts: EndpointOption,
					paraIds: ParaIds,
				) => Promise<ParaIds>
			>
		).mockResolvedValueOnce({
			kusama: [1000, 1001, 1002],
		});

		//NOTE: use return value
		await createChainRegistryFromParas(
			'kusama',
			prodParasKusamaCommon,
			registry,
			paraIds,
		);
		expect(registry).toEqual({
			polkadot: {},
			kusama: {
				'1000': {
					tokens: ['KSM'],
					assetsInfo: {},
					foreignAssetsInfo: {},
					poolPairsInfo: {},
					specName: 'statemine',
				},
				'1001': {
					tokens: ['KSM'],
					assetsInfo: {},
					foreignAssetsInfo: {},
					poolPairsInfo: {},
					specName: 'encointer-parachain',
				},
				'1002': {
					tokens: ['KSM'],
					assetsInfo: {},
					foreignAssetsInfo: {},
					poolPairsInfo: {},
					specName: 'bridge-hub-kusama',
				},
			},
			westend: {},
			rococo: {},
		});
	});
});
