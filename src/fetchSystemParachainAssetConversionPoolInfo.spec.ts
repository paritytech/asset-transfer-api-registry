// Copyright 2023 Parity Technologies (UK) Ltd.

import { fetchSystemParachainAssetConversionPoolInfo } from './fetchSystemParachainAssetConversionPoolInfo';
import { adjustedmockAssetHubKusamaApi } from './testHelpers/adjustedMockAssetHubKusamaApi';

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
