// Copyright 2024 Parity Technologies (UK) Ltd.

import { prodRelayKusama, prodRelayPolkadot } from '@polkadot/apps-config';
import { describe, expect, it, vi } from 'vitest';

import { createChainRegistryFromRelay } from './createChainRegistryFromRelay.js';
import { fetchChainInfo } from './fetchChainInfo.js';
import { mockKusamaRelayApi } from './testHelpers/mockKusamaRelayApi.js';
import { mockPolkadotApi } from './testHelpers/mockPolkadotRelayApi.js';
import { twirlTimer } from './util.js';

vi.mock('./fetchChainInfo', () => {
	return {
		fetchChainInfo: vi.fn(),
	};
});
vi.mock('./util.js', async (importOriginal) => {
	const mod = await importOriginal<typeof import('./util.js')>();

	return {
		...mod,
		twirlTimer: vi.fn(),
	};
});
vi.mocked(twirlTimer).mockReturnValueOnce(setTimeout(() => {}, 0));

describe('createChainRegistryFromRelay', () => {
	it('Should correctly create the registry for kusama', async () => {
		vi.mocked(fetchChainInfo).mockReturnValue(
			Promise.resolve([
				{
					tokens: ['KSM'],
					assetsInfo: {},
					foreignAssetsInfo: {},
					poolPairsInfo: {},
					specName: 'kusama',
				},
				undefined,
			]),
		);

		const result = await createChainRegistryFromRelay(
			// mockKusamaRelayApi,
			'kusama',
			prodRelayKusama,
			{ polkadot: {}, kusama: {}, westend: {}, rococo: {} },
		);
		expect(vi.isMockFunction(fetchChainInfo)).toBeTruthy();
		expect(fetchChainInfo).toHaveBeenCalled();
		expect(twirlTimer).toHaveBeenCalled();
		expect(result).toEqual({
			polkadot: {},
			kusama: {
				'0': {
					tokens: ['KSM'],
					assetsInfo: {},
					foreignAssetsInfo: {},
					poolPairsInfo: {},
					specName: 'kusama',
				},
			},
			westend: {},
			rococo: {},
		});
	});
	it('Should correctly create the registry for polkadot', async () => {
		vi.mocked(fetchChainInfo).mockReturnValue(
			Promise.resolve([
				{
					tokens: ['DOT'],
					assetsInfo: {},
					foreignAssetsInfo: {},
					poolPairsInfo: {},
					specName: 'polkadot',
				},
				undefined,
			]),
		);

		const result = await createChainRegistryFromRelay(
			// mockPolkadotApi,
			'polkadot',
			prodRelayPolkadot,
			{ polkadot: {}, kusama: {}, westend: {}, rococo: {} },
		);
		expect(vi.isMockFunction(fetchChainInfo)).toBeTruthy();
		expect(fetchChainInfo).toHaveBeenCalled();
		expect(twirlTimer).toHaveBeenCalled();
		expect(result).toEqual({
			polkadot: {
				'0': {
					tokens: ['DOT'],
					assetsInfo: {},
					foreignAssetsInfo: {},
					poolPairsInfo: {},
					specName: 'polkadot',
				},
			},
			kusama: {},
			westend: {},
			rococo: {},
		});
	});
});
