// Copyright 2024 Parity Technologies (UK) Ltd.

import { describe, expect, it } from 'vitest';

import { fetchSystemParachainAssetConversionPoolInfo } from './fetchSystemParachainAssetConversionPoolInfo.js';
import { adjustedmockAssetHubKusamaApi } from './testHelpers/adjustedMockAssetHubKusamaApi.js';

describe('fetchSystemParachainAssetConversionPoolInfo', () => {
	it('Should correctly return the Asset Conversion Pool Info for Asset Hub', async () => {
		const result = await fetchSystemParachainAssetConversionPoolInfo(
			adjustedmockAssetHubKusamaApi,
		);

		expect(result).toEqual({
			'0': {
				lpToken: 0,
				pairInfo:
					'[[{"parents":"0","interior":{"Here":""}},{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"100"}]}}]]',
			},
		});
	});
});
