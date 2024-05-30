import { getAssetReserveLocations } from './getAssetReserveLocations';

describe('getAssetReserveLocations', () => {
	type Test = [
		assetLocation: string,
		chainId: number,
		reserveLocations: string[],
	];

	it('Should correctly get reserve locations given an assets location', () => {
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
	it('Should correctly throw an error when a location containing the Here junction is provided as an argument', () => {
		const location = '{"parents":"1","interior":{"Here":""}}';
		const chainId = 1000;

		const err = () => getAssetReserveLocations(location, chainId);

		expect(err).toThrow(
			'Unable to derive chain origin from location {"parents":"1","interior":{"Here":""}}',
		);
	});
	it('Should correctly throw an error when an invalid location value is provided', () => {
		const location = '{"parents":"1","interior":{"Here":}}';
		const chainId = 1000;

		const err = () => getAssetReserveLocations(location, chainId);

		expect(err).toThrow(
			'Unable to parse {"parents":"1","interior":{"Here":}} as a valid location',
		);
	});
});
