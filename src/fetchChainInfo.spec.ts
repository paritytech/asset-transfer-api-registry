// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';
import { prodRelayKusama } from '@polkadot/apps-config';
import { EndpointOption } from '@polkadot/apps-config/endpoints/types';

import { fetchChainInfo } from './fetchChainInfo';
import { fetchSystemParachainAssetConversionPoolInfo } from './fetchSystemParachainAssetConversionPoolInfo';
import { fetchSystemParachainAssetInfo } from './fetchSystemParachainAssetInfo';
import { fetchSystemParachainForeignAssetInfo } from './fetchSystemParachainForeignAssetInfo';
import { getApi } from './getApi';
import { adjustedmockAssetHubKusamaApi } from './testHelpers/adjustedMockAssetHubKusamaApi';
import { adjustedMockBifrostKusamaParachainApi } from './testHelpers/adjustedMockBifrostKusamaParachainApi';
import { adjustedMockKusamaRelayApi } from './testHelpers/adjustedMockKusamaRelayApi';
import { mockAssetHubKusamaParachainPoolPairsInfo } from './testHelpers/mockSystemParachainAssetConversionPoolInfo';
import { mockAssetHubKusamaParachainAssetsInfo } from './testHelpers/mockSystemParachainAssetInfo';
import { mockAssetHubKusamaParachainForeignAssetsInfo } from './testHelpers/mockSystemParachainForeignAssetInfo';
import type { AssetsInfo, ForeignAssetsInfo, PoolPairsInfo } from './types';

jest.mock('./getApi');
jest.mock('./fetchSystemParachainAssetInfo');
jest.mock('./fetchSystemParachainForeignAssetInfo');
jest.mock('./fetchSystemParachainAssetConversionPoolInfo');

describe('fetchChainInfo', () => {
	describe('Kusama', () => {
		it('Correctly fetches Kusama ChainInfo', async () => {
			(
				getApi as jest.MockedFunction<
					(
						endpointOpts: EndpointOption,
						chain: string,
						isRelay?: boolean,
					) => Promise<ApiPromise | null | undefined>
				>
			).mockResolvedValueOnce(adjustedMockKusamaRelayApi);
			(
				fetchSystemParachainAssetInfo as jest.MockedFunction<
					(api: ApiPromise) => Promise<AssetsInfo>
				>
			).mockResolvedValueOnce({});
			(
				fetchSystemParachainForeignAssetInfo as jest.MockedFunction<
					(api: ApiPromise) => Promise<ForeignAssetsInfo>
				>
			).mockResolvedValueOnce({});
			(
				fetchSystemParachainAssetConversionPoolInfo as jest.MockedFunction<
					(api: ApiPromise) => Promise<PoolPairsInfo>
				>
			).mockResolvedValueOnce({});

			await expect(
				fetchChainInfo(
					prodRelayKusama,
					prodRelayKusama.info as unknown as string,
					true,
				),
			).resolves.toEqual({
				tokens: ['KSM'],
				specName: 'kusama',
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
			});
		});
	});

	describe('AssetHub Kusama', () => {
		it('Correctly fetches AssetHub Kusama ChainInfo', async () => {
			(
				getApi as jest.MockedFunction<
					(
						endpointOpts: EndpointOption,
						chain: string,
						isRelay?: boolean,
					) => Promise<ApiPromise | null | undefined>
				>
			).mockResolvedValueOnce(adjustedmockAssetHubKusamaApi);
			(
				fetchSystemParachainAssetInfo as jest.MockedFunction<
					(api: ApiPromise) => Promise<AssetsInfo>
				>
			).mockResolvedValueOnce(mockAssetHubKusamaParachainAssetsInfo);
			(
				fetchSystemParachainForeignAssetInfo as jest.MockedFunction<
					(api: ApiPromise) => Promise<ForeignAssetsInfo>
				>
			).mockResolvedValueOnce(mockAssetHubKusamaParachainForeignAssetsInfo);
			(
				fetchSystemParachainAssetConversionPoolInfo as jest.MockedFunction<
					(api: ApiPromise) => Promise<PoolPairsInfo>
				>
			).mockResolvedValueOnce(mockAssetHubKusamaParachainPoolPairsInfo);

			await expect(
				fetchChainInfo(
					prodRelayKusama,
					prodRelayKusama.info as unknown as string,
					false,
				),
			).resolves.toEqual({
				tokens: ['KSM'],
				specName: 'asset-hub-kusama',
				assetsInfo: {
					'0': 'DOG',
					'1': 'L T',
					'2': 'PNN',
					'3': 'Meow',
					'4': 'HAPPY',
					'5': 'BEER',
					'6': 'ZKPD',
					'7': 'DOS',
					'8': 'RMRK',
					'9': 'TOT',
					'10': 'USDC',
					'11': 'USDT',
					'12': 'BUSD',
					'13': 'LN',
					'14': 'DOT',
					'15': 'Web3',
					'16': 'ARIS',
					'17': 'MEME',
					'18': 'HEI',
					'19': 'SHOT',
					'20': 'BFKK',
					'21': 'ELEV',
					'22': 'STH',
					'23': 'KOJO',
					'24': 'test',
					'25': 'BABE',
					'26': 'BUNGA',
					'27': 'RUNE',
					'28': 'LAC',
					'29': 'CODES',
					'30': 'GOL',
					'31': 'ki',
					'32': 'FAV',
					'33': 'BUSSY',
					'34': 'PLX',
					'35': 'LUCKY',
					'36': 'RRT',
					'37': 'MNCH',
					'38': 'ENT',
					'39': 'DSCAN',
					'40': 'ERIC',
					'41': 'GOOSE',
					'42': 'NRNF',
					'43': 'TTT',
					'44': 'ADVNCE',
					'45': 'CRIB',
					'46': 'FAN',
					'47': 'EUR',
					'49': 'DIAN',
					'50': 'PROMO',
					'55': 'MTS',
					'60': 'GAV',
					'61': 'CRY',
					'64': 'oh!',
					'66': 'DAI',
					'68': 'ADVERT',
					'69': 'NICE',
					'70': 'MAR',
					'71': 'OAK',
					'75': 'cipher',
					'77': 'Crypto',
					'87': 'XEXR',
					'88': 'BTC',
					'90': 'SATS',
					'91': 'TMJ',
					'99': 'BITCOIN',
					'100': 'Chralt',
					'101': '---',
					'102': 'DRX',
					'111': 'NO1',
					'117': 'TNKR',
					'123': 'NFT',
					'138': 'Abc',
					'168': 'Tokens',
					'188': 'ZLK',
					'200': 'SIX',
					'214': 'LOVE',
					'222': 'PNEO',
					'223': 'BILL',
					'224': 'SIK',
					'300': 'PWS',
					'333': 'Token',
					'345': '345',
					'360': 'uni',
					'365': 'time',
					'374': 'wETH',
					'377': 'KAA',
					'383': 'KODA',
					'404': 'MAXI',
					'420': 'BLAZE',
					'520': '0xe299a5e299a5e299a5',
					'555': 'GAME',
					'567': 'CHRWNA',
					'569': 'KUSA',
					'598': 'EREN',
					'666': 'BAD',
					'677': 'GRB',
					'759': 'bLd',
					'777': 'GOD',
					'813': 'TBUX',
					'841': 'YAYOI',
					'888': 'LUCK',
					'911': '911',
					'969': 'WGTL',
					'999': 'CBDC',
					'1000': 'SPARK',
					'1107': 'HOLIC',
					'1111': 'MTVD',
					'1123': 'XEN',
					'1155': 'WITEK',
					'1225': 'GOD',
					'1234': 'KSM',
					'1313': 'TACP',
					'1337': 'TIP',
					'1420': 'HYDR',
					'1441': 'SPOT',
					'1526': 'bcd',
					'1607': 'STRGZN',
					'1688': 'ali',
					'1984': 'USDt',
					'1999': 'ADVERT2',
					'2021': 'WAVE',
					'2048': 'RWS',
					'2049': 'Android',
					'2050': 'CUT',
					'2077': 'XRT',
					'3000': 'GRAIN',
					'3001': 'DUCK',
					'3077': 'ACT',
					'3327': 'MVPW',
					'3328': 'A42',
					'3721': 'fast',
					'3943': 'GMK',
					'6789': 'VHM',
					'6967': 'CHAOS',
					'7777': 'lucky7',
					'8848': 'top',
					'9000': 'KPOTS',
					'9999': 'BTC',
					'11111': 'KVC',
					'12345': 'DREX',
					'19840': 'USDt',
					'42069': 'INTRN',
					'69420': 'CHAOS',
					'80815': 'KSMFS',
					'80816': 'RUEPP',
					'80817': 'FRALEY',
					'88888': 'BAILEGO',
					'95834': 'LUL',
					'131313': 'DMO',
					'220204': 'STM',
					'314159': 'RTT',
					'777777': 'DEFI',
					'862812': 'CUBO',
					'863012': 'VCOP',
					'4206969': 'SHIB',
					'5201314': 'belove',
					'5797867': 'TAKE',
					'7777777': 'king',
					'4294967291': 'PRIME',
				},
				foreignAssetsInfo: {
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
				},
				poolPairsInfo: {
					'0': {
						lpToken: '0',
						pairInfo:
							'[[{"parents":"1","interior":"Here"},{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"5797867"}]}}]]',
					},
					'1': {
						lpToken: '1',
						pairInfo:
							'[[{"parents":"1","interior":"Here"},{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"1984"}]}}]]',
					},
					'2': {
						lpToken: '2',
						pairInfo:
							'[[{"parents":"1","interior":"Here"},{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"1313"}]}}]]',
					},
					'3': {
						lpToken: '3',
						pairInfo:
							'[[{"parents":"1","interior":"Here"},{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"3327"}]}}]]',
					},
					'4': {
						lpToken: '4',
						pairInfo:
							'[[{"parents":"1","interior":"Here"},{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"3328"}]}}]]',
					},
					'5': {
						lpToken: '5',
						pairInfo:
							'[[{"parents":"1","interior":"Here"},{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"131313"}]}}]]',
					},
				},
			});
		});
	});

	describe('Bifrost', () => {
		it('Correctly fetches Bifrost Kusama ChainInfo', async () => {
			(
				getApi as jest.MockedFunction<
					(
						endpointOpts: EndpointOption,
						chain: string,
						isRelay?: boolean,
					) => Promise<ApiPromise | null | undefined>
				>
			).mockResolvedValueOnce(adjustedMockBifrostKusamaParachainApi);
			(
				fetchSystemParachainAssetInfo as jest.MockedFunction<
					(api: ApiPromise) => Promise<AssetsInfo>
				>
			).mockResolvedValueOnce({});
			(
				fetchSystemParachainForeignAssetInfo as jest.MockedFunction<
					(api: ApiPromise) => Promise<ForeignAssetsInfo>
				>
			).mockResolvedValueOnce({});
			(
				fetchSystemParachainAssetConversionPoolInfo as jest.MockedFunction<
					(api: ApiPromise) => Promise<PoolPairsInfo>
				>
			).mockResolvedValueOnce({});

			await expect(
				fetchChainInfo(
					prodRelayKusama,
					prodRelayKusama.info as unknown as string,
					true,
				),
			).resolves.toEqual({
				tokens: ['BNC'],
				specName: 'bifrost',
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
			});
		});
	});
});
