// Copyright 2023 Parity Technologies (UK) Ltd.

import { prodParasKusamaCommon } from '@polkadot/apps-config';
import { EndpointOption } from '@polkadot/apps-config/endpoints/types';

import {
	appendFetchChainInfoPromise,
	createChainRegistryFromParas,
} from './createChainRegistryFromParas';
import { fetchParaIds } from './fetchParaIds';
import { ChainName, ParaIds, TokenRegistry } from './types';
import { twirlTimer } from './util';

jest.mock('./util');
jest.mock('./createChainRegistryFromParas');
jest.mock('./fetchChainInfo');
jest.mock('./fetchParaIds');

const newRegistry: TokenRegistry = {
	polkadot: {},
	kusama: {},
	westend: {},
	rococo: {},
};
const currentRegistry: TokenRegistry = {
	polkadot: {},
	kusama: {},
	westend: {},
	rococo: {},
};

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
					newRegistry['kusama']['1000'] = res;
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
					newRegistry['kusama']['1001'] = res;
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
					newRegistry['kusama']['1002'] = res;
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
			newRegistry,
			currentRegistry,
			paraIds,
		);
		expect(newRegistry).toEqual({
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
