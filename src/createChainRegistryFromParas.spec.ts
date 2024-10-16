// Copyright 2024 Parity Technologies (UK) Ltd.

import { prodParasKusamaCommon } from '@polkadot/apps-config';
import { describe, expect, it, vi } from 'vitest';

import { DEFAULT_REGISTRY } from './consts.js';
import type { ParaIds } from './types.js';
const paraIds: ParaIds = { kusama: [1000, 1001, 1002] };

import { createChainRegistryFromParas } from './createChainRegistryFromParas.js';
import { updateRegistryChainInfo } from './updateRegistryChainInfo.js';

vi.mock('./updateRegistryChainInfo', () => {
	return {
		updateRegistryChainInfo: vi.fn(),
	};
});

vi.mocked(updateRegistryChainInfo).mockReturnValue(
	Promise.resolve({
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
		paseo: {},
	}),
);

describe('createChainRegistryFromParas', () => {
	it('Should correctly add the registries for paras when found', async () => {
		const result = await createChainRegistryFromParas(
			'kusama',
			prodParasKusamaCommon,
			DEFAULT_REGISTRY,
			paraIds,
		);

		expect(vi.isMockFunction(updateRegistryChainInfo)).toBeTruthy();
		expect(updateRegistryChainInfo).toHaveBeenCalled();
		expect(result).toStrictEqual({
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
			paseo: {},
		});
	});
});
