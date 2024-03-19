// Copyright 2023 Parity Technologies (UK) Ltd.

import { jest } from '@jest/globals'

import { prodParasKusamaCommon } from '@polkadot/apps-config';


import { DEFAULT_REGISTRY } from './consts.js';
import {
	createChainRegistryFromParas,
} from './createChainRegistryFromParas.js';
import type { ParaIds, TokenRegistry } from './types.js';

jest.setTimeout(60000);
jest.mock('./util', () => ({
	twirlTimer: (() => setTimeout(() => {}, 0))
}));
jest.mock('./createChainRegistryFromParas',() => ({
	appendFetchChainInfoPromise: async () => {
		await Promise.resolve({
			tokens: ['KSM'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			poolPairsInfo: {},
			specName: 'statemine',
		}).then((res) => {
			registry['kusama']['1000'] = res;
		})
		await Promise.resolve({
			tokens: ['KSM'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			poolPairsInfo: {},
			specName: 'bridge-hub-kusama',
		}).then((res) => {
			registry['kusama']['1002'] = res;
		})
		await Promise.resolve({
			tokens: ['KSM'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			poolPairsInfo: {},
			specName: 'bridge-hub-kusama',
		}).then((res) => {
			registry['kusama']['1002'] = res;
		})
	}
}));
jest.mock('./fetchParaIds', () => ({
	fetchParaIds: () => ({kusama: [1000, 1001, 1002]})
}));

const registry: TokenRegistry = DEFAULT_REGISTRY;

describe('CreateRegistryFromParas', () => {
	it('Should correctly add the registries for paras when found', async () => {
		const paraIds: ParaIds = { kusama: [1000, 1001, 1002] };

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
