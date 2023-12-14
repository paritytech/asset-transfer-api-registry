// Copyright 2023 Parity Technologies (UK) Ltd.

import { prodRelayKusama, prodRelayPolkadot } from '@polkadot/apps-config';

import { createChainRegistryFromRelay } from './createChainRegistryFromRelay';
import { fetchChainInfo } from './fetchChainInfo';
import { TokenRegistry } from './types';
import { twirlTimer } from './util';

jest.mock('./util');
jest.mock('./fetchChainInfo');
jest.mock('./fetchParaIds');

describe('createChainRegistryFromRelay', () => {
	it('Should correctly create the registry for kusama', async () => {
		(twirlTimer as jest.MockedFunction<any>).mockResolvedValueOnce();
		(fetchChainInfo as jest.MockedFunction<any>).mockReturnValueOnce({
			tokens: ['KSM'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			poolPairsInfo: {},
			specName: 'kusama',
		});

		const registry: TokenRegistry = {
			polkadot: {},
			kusama: {},
			westend: {},
			rococo: {},
		};

		await createChainRegistryFromRelay('kusama', prodRelayKusama, registry);
		expect(registry).toEqual({
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
		(twirlTimer as jest.MockedFunction<any>).mockResolvedValueOnce();
		(fetchChainInfo as jest.MockedFunction<any>).mockReturnValueOnce({
			tokens: ['DOT'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			poolPairsInfo: {},
			specName: 'polkadot',
		});

		const registry: TokenRegistry = {
			polkadot: {},
			kusama: {},
			westend: {},
			rococo: {},
		};

		await createChainRegistryFromRelay('polkadot', prodRelayPolkadot, registry);
		expect(registry).toEqual({
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
