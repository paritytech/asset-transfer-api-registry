// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ForeignAssetsInfo } from '../types';

export const mockAssetHubKusamaParachainForeignAssetsInfo: ForeignAssetsInfo = {
	'0x7b22706172656e7473223a2232222c22696e746572696f72223a7b225831223a7b22476c6f62616c436f6e73656e737573223a22506f6c6b61646f74227d7d7d':
		{
			symbol: '',
			name: '',
			multiLocation:
				'{"parents":"2","interior":{"X1":{"GlobalConsensus":"Polkadot"}}}',
		},
	TNKR: {
		symbol: 'TNKR',
		name: 'Tinkernet',
		multiLocation:
			'{"parents":"1","interior":{"X2":[{"Parachain":"2125"},{"GeneralIndex":"0"}]}}',
	},
};
