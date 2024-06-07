// Copyright 2024 Parity Technologies (UK) Ltd.

import type { AnyJson } from '@polkadot/types/types';

import { getAssetReserveLocations } from './getAssetReserveLocations';

describe('getAssetReserveLocations', () => {
	type Test = [
		assetLocation: string | AnyJson,
		chainId: number,
		reserveLocations: [string, string | undefined],
	];

	it('Should correctly get the relative reserve locations given an assets location and the host chains ID', () => {
		const tests: Test[] = [
			[
				'{"parents":"1","interior":{"X2":[{"Parachain":"2011"},{"GeneralKey":{"length":"3","data":"0x6571640000000000000000000000000000000000000000000000000000000000"}}]}}',
				1000,
				[
					'{"parents":"0","interior":{"Here":""}}',
					'{"parents":"1","interior":{"X1":{"Parachain":"2011"}}}',
				],
			],
			[
				'{"parents":"1","interior":{"X2":[{"Parachain":"2011"},{"GeneralKey":{"length":"3","data":"0x6571640000000000000000000000000000000000000000000000000000000000"}}]}}',
				2011,
				[
					'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
					'{"parents":"0","interior":{"Here":""}}',
				],
			],
			[
				'{"parents":"1","interior":{"X2":[{"Parachain":"2004"},{"PalletInstance":"10"}]}}',
				1000,
				[
					'{"parents":"0","interior":{"Here":""}}',
					'{"parents":"1","interior":{"X1":{"Parachain":"2004"}}}',
				],
			],
			[
				'{"parents":"1","interior":{"X2":[{"Parachain":"2004"},{"PalletInstance":"10"}]}}',
				2004,
				[
					'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
					'{"parents":"0","interior":{"Here":""}}',
				],
			],
			[
				'{"parents":"2","interior":{"X1":{"GlobalConsensus":"Kusama"}}}',
				1000,
				[
					'{"parents":"0","interior":{"Here":""}}',
					'{"parents":"2","interior":{"X2":[{"GlobalConsensus":"Kusama"},{"Parachain":"1000"}]}}',
				],
			],
			[
				'{"parents":"2","interior":{"X1":{"GlobalConsensus":"Polkadot"}}}',
				1000,
				[
					'{"parents":"0","interior":{"Here":""}}',
					'{"parents":"2","interior":{"X2":[{"GlobalConsensus":"Polkadot"},{"Parachain":"1000"}]}}',
				],
			],
			[
				'{"parents":"2","interior":{"X1":{"GlobalConsensus":"Polkadot"}}}',
				2023,
				[
					'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
					'{"parents":"2","interior":{"X2":[{"GlobalConsensus":"Polkadot"},{"Parachain":"1000"}]}}',
				],
			],
			[
				'{"parents":"1","interior":{"X1":{"Parachain":"2011"}}}',
				1000,
				[
					'{"parents":"0","interior":{"Here":""}}',
					'{"parents":"1","interior":{"X1":{"Parachain":"2011"}}}',
				],
			],
			[
				'{"parents":"1","interior":{"X1":{"Parachain":"2011"}}}',
				2011,
				[
					'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
					'{"parents":"0","interior":{"Here":""}}',
				],
			],
			[
				'{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xfff9976782d46cc05630d1f6ebab18b2324d6b14"}}]}}',
				1000,
				[
					'{"parents":"0","interior":{"Here":""}}',
					'{"parents":"2","interior":{"X1":{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}}}}',
				],
			],
			[
				'{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xfff9976782d46cc05630d1f6ebab18b2324d6b14"}}]}}',
				2030,
				[
					'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
					'{"parents":"2","interior":{"X1":{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}}}}',
				],
			],
		];

		for (const test of tests) {
			const [assetLocation, chainId, expected] = test;

			const result = getAssetReserveLocations(assetLocation, chainId);
			expect(result).toEqual(expected);
		}
	});
	it('Should correctly get the relative reserve locations given an xc assets registry v1 location json object and the host chains ID', () => {
		const tests: Test[] = [
			[
				{
					v1: {
						parents: 1,
						interior: { x2: [{ parachain: 2023 }, { palletInstance: 10 }] },
					},
				},
				1000,
				[
					'{"parents":"0","interior":{"Here":""}}',
					'{"parents":"1","interior":{"X1":{"Parachain":"2023"}}}',
				],
			],
			[
				{
					v1: {
						parents: 1,
						interior: { x2: [{ parachain: 2024 }, { generalKey: '0x657164' }] },
					},
				},
				2024,
				[
					'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
					'{"parents":"0","interior":{"Here":""}}',
				],
			],
			[
				{
					v1: {
						parents: 1,
						interior: {
							x3: [
								{ parachain: 1000 },
								{ palletInstance: 50 },
								{ generalIndex: 1984 },
							],
						},
					},
				},
				1000,
				['{"parents":"0","interior":{"Here":""}}', undefined],
			],
			[
				'{"parents":"1","interior":{"X2":[{"Parachain":"2004"},{"PalletInstance":"10"}]}}',
				2004,
				[
					'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
					'{"parents":"0","interior":{"Here":""}}',
				],
			],
			[
				{
					v1: {
						parents: 1,
						interior: { x2: [{ parachain: 2001 }, { generalKey: '0x0101' }] },
					},
				},
				2001,
				[
					'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
					'{"parents":"0","interior":{"Here":""}}',
				],
			],
			[
				{ v1: { parents: 0, interior: { here: '' } } },
				0,
				[
					'{"parents":"0","interior":{"X1":{"Parachain":"1000"}}}',
					'{"Parents":"0","Interior":{"Here":""}}',
				],
			],
			[
				{ v1: { parents: 1, interior: { here: '' } } },
				2030,
				[
					'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
					'{"Parents":"1","Interior":{"Here":""}}',
				],
			],
			[
				{
					v1: {
						parents: 1,
						interior: {
							x3: [
								{ parachain: 1000 },
								{ palletInstance: 50 },
								{ generalIndex: 1984 },
							],
						},
					},
				},
				2030,
				['{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}', undefined],
			],
			[
				{
					v1: {
						parents: 2,
						interior: {
							x2: [
								{ globalConsensus: { ethereum: { chainId: 11155111 } } },
								{
									AccountKey20: {
										network: '',
										key: '0xfff9976782d46cc05630d1f6ebab18b2324d6b14',
									},
								},
							],
						},
					},
				},
				2023,
				[
					'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
					'{"parents":"2","interior":{"X1":{"GlobalConsensus":{"Ethereum":{"ChainId":"11155111"}}}}}',
				],
			],
			[
				{
					v1: { parents: 2, interior: { x1: { globalConsensus: 'polkadot' } } },
				},
				2023,
				[
					'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
					'{"parents":"2","interior":{"X2":[{"GlobalConsensus":"Polkadot"},{"Parachain":"1000"}]}}',
				],
			],
			[
				{ v1: { parents: 2, interior: { x1: { globalConsensus: 'kusama' } } } },
				1000,
				[
					'{"parents":"0","interior":{"Here":""}}',
					'{"parents":"2","interior":{"X2":[{"GlobalConsensus":"Kusama"},{"Parachain":"1000"}]}}',
				],
			],
		];

		for (const test of tests) {
			const [assetLocation, chainId, expected] = test;

			const result = getAssetReserveLocations(assetLocation, chainId);
			expect(result).toEqual(expected);
		}
	});
	it('Should correctly throw an error when an invalid location value is provided', () => {
		const location = '{"parents":"1","interior":{"Here":}}';
		const chainId = 1000;

		const err = () => getAssetReserveLocations(location, chainId);

		expect(err).toThrow(
			`Unable to parse ${JSON.stringify(location)} as a valid location`,
		);
	});
});
