// Copyright 2023 Parity Technologies (UK) Ltd.

import { prodRelayKusama, prodRelayPolkadot } from '@polkadot/apps-config';
import { EndpointOption } from '@polkadot/apps-config/endpoints/types';

import { createChainRegistryFromRelay } from './createChainRegistryFromRelay';
import { fetchChainInfo } from './fetchChainInfo';
import type { ChainInfoKeys, TokenRegistry } from './types';
import { twirlTimer } from './util';

jest.mock('./util');
jest.mock('./fetchChainInfo');
jest.mock('./fetchParaIds');

describe('createChainRegistryFromRelay', () => {
	it('Should correctly create the registry for kusama', async () => {
		(
			twirlTimer as jest.MockedFunction<() => NodeJS.Timeout>
		).mockReturnValueOnce(setTimeout(() => {}, 0));
		(
			fetchChainInfo as jest.MockedFunction<
				(
					endpointOpts: EndpointOption,
					chain: string,
					isRelay?: boolean,
				) => Promise<ChainInfoKeys | null>
			>
		).mockReturnValueOnce(
			Promise.resolve({
				tokens: ['KSM'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'kusama',
			}),
		);

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
		(
			twirlTimer as jest.MockedFunction<() => NodeJS.Timeout>
		).mockReturnValueOnce(setTimeout(() => {}, 0));
		(
			fetchChainInfo as jest.MockedFunction<
				(
					endpointOpts: EndpointOption,
					chain: string,
					isRelay?: boolean,
				) => Promise<ChainInfoKeys | null>
			>
		).mockReturnValueOnce(
			Promise.resolve({
				tokens: ['DOT'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'polkadot',
			}),
		);

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
