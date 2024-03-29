export const moonBeamTestXcAssets = {
	relayChain: 'polkadot',
	paraID: 2004,
	id: 'moonbeam',
	xcAssetCnt: '28',
	data: [
		{
			paraID: 0,
			relayChain: 'polkadot',
			nativeChainID: 'polkadot',
			symbol: 'DOT',
			decimals: 10,
			interiorType: 'here',
			xcmV1Standardized: [
				{
					network: 'polkadot',
				},
				'here',
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						here: null,
					},
				},
			},
			asset: '42259045809535163221576417993425387648',
			contractAddress: '0xffffffff1fcacbd218edc0eba20fc2308c778080',
			source: ['2004'],
		},
		{
			paraID: 1000,
			relayChain: 'polkadot',
			nativeChainID: 'statemint',
			symbol: 'USDC',
			decimals: 6,
			interiorType: 'x3',
			xcmV1Standardized: [
				{
					network: 'polkadot',
				},
				{
					parachain: 1000,
				},
				{
					palletInstance: 50,
				},
				{
					generalIndex: 1337,
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x3: [
							{
								parachain: 1000,
							},
							{
								palletInstance: 50,
							},
							{
								generalIndex: 1337,
							},
						],
					},
				},
			},
			asset: '166377000701797186346254371275954761085',
			contractAddress: '0xffffffff7d2b0b761af01ca8e25242976ac0ad7d',
			source: ['2004'],
		},
		{
			paraID: 1000,
			relayChain: 'polkadot',
			nativeChainID: 'statemint',
			symbol: 'USDT',
			decimals: 6,
			interiorType: 'x3',
			xcmV1Standardized: [
				{
					network: 'polkadot',
				},
				{
					parachain: 1000,
				},
				{
					palletInstance: 50,
				},
				{
					generalIndex: 1984,
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x3: [
							{
								parachain: 1000,
							},
							{
								palletInstance: 50,
							},
							{
								generalIndex: 1984,
							},
						],
					},
				},
			},
			asset: '311091173110107856861649819128533077277',
			contractAddress: '0xffffffffea09fb06d082fd1275cd48b191cbcd1d',
			source: ['2004'],
		},
		{
			paraID: 2000,
			relayChain: 'polkadot',
			nativeChainID: 'acala',
			symbol: 'LDOT',
			decimals: 10,
			interiorType: 'x2',
			xcmV1Standardized: [
				{
					network: 'polkadot',
				},
				{
					parachain: 2000,
				},
				{
					generalKey: '0x0003',
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x2: [
							{
								parachain: 2000,
							},
							{
								generalKey: '0x0003',
							},
						],
					},
				},
			},
			asset: '225719522181998468294117309041779353812',
			contractAddress: '0xffffffffa9cfffa9834235fe53f4733f1b8b28d4',
			source: ['2004'],
		},
		{
			paraID: 2000,
			relayChain: 'polkadot',
			nativeChainID: 'acala',
			symbol: 'aUSD',
			decimals: 12,
			interiorType: 'x2',
			xcmV1Standardized: [
				{
					network: 'polkadot',
				},
				{
					parachain: 2000,
				},
				{
					generalKey: '0x0001',
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x2: [
							{
								parachain: 2000,
							},
							{
								generalKey: '0x0001',
							},
						],
					},
				},
			},
			asset: '110021739665376159354538090254163045594',
			contractAddress: '0xffffffff52c56a9257bb97f4b2b6f7b2d624ecda',
			source: ['2004'],
		},
		{
			paraID: 2000,
			relayChain: 'polkadot',
			nativeChainID: 'acala',
			symbol: 'ACA',
			decimals: 12,
			interiorType: 'x2',
			xcmV1Standardized: [
				{
					network: 'polkadot',
				},
				{
					parachain: 2000,
				},
				{
					generalKey: '0x0000',
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x2: [
							{
								parachain: 2000,
							},
							{
								generalKey: '0x0000',
							},
						],
					},
				},
			},
			asset: '224821240862170613278369189818311486111',
			contractAddress: '0xffffffffa922fef94566104a6e5a35a4fcddaa9f',
			source: ['2004'],
		},
		{
			paraID: 2006,
			relayChain: 'polkadot',
			nativeChainID: 'astar',
			symbol: 'ASTR',
			decimals: 18,
			interiorType: 'x1',
			xcmV1Standardized: [
				{
					network: 'polkadot',
				},
				{
					parachain: 2006,
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x1: {
							parachain: 2006,
						},
					},
				},
			},
			asset: '224077081838586484055667086558292981199',
			contractAddress: '0xffffffffa893ad19e540e172c10d78d4d479b5cf',
			source: ['2004'],
		},
		{
			paraID: 2011,
			relayChain: 'polkadot',
			nativeChainID: 'equilibrium',
			symbol: 'EQD',
			decimals: 9,
			interiorType: 'x2',
			xcmV1Standardized: [
				{
					network: 'polkadot',
				},
				{
					parachain: 2011,
				},
				{
					generalKey: '0x657164',
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x2: [
							{
								parachain: 2011,
							},
							{
								generalKey: '0x657164',
							},
						],
					},
				},
			},
			asset: '187224307232923873519830480073807488153',
			contractAddress: '0xffffffff8cda1707baf23834d211b08726b1e499',
			source: ['2004'],
		},
		{
			paraID: 2011,
			relayChain: 'polkadot',
			nativeChainID: 'equilibrium',
			symbol: 'EQ',
			decimals: 9,
			interiorType: 'x1',
			xcmV1Standardized: [
				{
					network: 'polkadot',
				},
				{
					parachain: 2011,
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x1: {
							parachain: 2011,
						},
					},
				},
			},
			asset: '190590555344745888270686124937537713878',
			contractAddress: '0xffffffff8f6267e040d8a0638c576dfba4f0f6d6',
			source: ['2004'],
		},
		{
			paraID: 2012,
			relayChain: 'polkadot',
			nativeChainID: 'parallel',
			symbol: 'PARA',
			decimals: 12,
			interiorType: 'x2',
			xcmV1Standardized: [
				{
					network: 'polkadot',
				},
				{
					parachain: 2012,
				},
				{
					generalKey: '0x50415241',
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x2: [
							{
								parachain: 2012,
							},
							{
								generalKey: '0x50415241',
							},
						],
					},
				},
			},
			asset: '32615670524745285411807346420584982855',
			contractAddress: '0xffffffff18898cb5fe1e88e668152b4f4052a947',
			source: ['2004'],
		},
		{
			paraID: 2026,
			relayChain: 'polkadot',
			nativeChainID: 'nodle',
			symbol: 'NODL',
			decimals: 11,
			interiorType: 'x2',
			xcmV1Standardized: [
				{
					network: 'polkadot',
				},
				{
					parachain: 2026,
				},
				{
					palletInstance: 2,
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x2: [
							{
								parachain: 2026,
							},
							{
								palletInstance: 2,
							},
						],
					},
				},
			},
			asset: '309163521958167876851250718453738106865',
			contractAddress: '0xffffffffe896ba7cb118b9fa571c6dc0a99deff1',
			source: ['2004'],
		},
		{
			paraID: 2030,
			relayChain: 'polkadot',
			nativeChainID: 'bifrost',
			symbol: 'FIL',
			decimals: 18,
			interiorType: 'x2',
			xcmV1Standardized: [
				{
					network: 'polkadot',
				},
				{
					parachain: 2030,
				},
				{
					generalKey: '0x0804',
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x2: [
							{
								parachain: 2030,
							},
							{
								generalKey: '0x0804',
							},
						],
					},
				},
			},
			asset: '144012926827374458669278577633504620722',
			contractAddress: '0xffffffff6c57e17d210df507c82807149ffd70b2',
			source: ['2004'],
		},
		{
			paraID: 2030,
			relayChain: 'polkadot',
			nativeChainID: 'bifrost',
			symbol: 'vDOT',
			decimals: 10,
			interiorType: 'x2',
			xcmV1Standardized: [
				{
					network: 'polkadot',
				},
				{
					parachain: 2030,
				},
				{
					generalKey: '0x0900',
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x2: [
							{
								parachain: 2030,
							},
							{
								generalKey: '0x0900',
							},
						],
					},
				},
			},
			asset: '29085784439601774464560083082574142143',
			contractAddress: '0xffffffff15e1b7e3df971dd813bc394deb899abf',
			source: ['2004'],
		},
		{
			paraID: 2030,
			relayChain: 'polkadot',
			nativeChainID: 'bifrost',
			symbol: 'vGLMR',
			decimals: 18,
			interiorType: 'x2',
			xcmV1Standardized: [
				{
					network: 'polkadot',
				},
				{
					parachain: 2030,
				},
				{
					generalKey: '0x0901',
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x2: [
							{
								parachain: 2030,
							},
							{
								generalKey: '0x0901',
							},
						],
					},
				},
			},
			asset: '204507659831918931608354793288110796652',
			contractAddress: '0xffffffff99dabe1a8de0ea22baa6fd48fde96f6c',
			source: ['2004'],
		},
		{
			paraID: 2030,
			relayChain: 'polkadot',
			nativeChainID: 'bifrost',
			symbol: 'BNC',
			decimals: 12,
			interiorType: 'x2',
			xcmV1Standardized: [
				{
					network: 'polkadot',
				},
				{
					parachain: 2030,
				},
				{
					generalKey: '0x0001',
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x2: [
							{
								parachain: 2030,
							},
							{
								generalKey: '0x0001',
							},
						],
					},
				},
			},
			asset: '165823357460190568952172802245839421906',
			contractAddress: '0xffffffff7cc06abdf7201b350a1265c62c8601d2',
			source: ['2004'],
		},
		{
			paraID: 2030,
			relayChain: 'polkadot',
			nativeChainID: 'bifrost',
			symbol: 'vFIL',
			decimals: 18,
			interiorType: 'x2',
			xcmV1Standardized: [
				{
					network: 'polkadot',
				},
				{
					parachain: 2030,
				},
				{
					generalKey: '0x0904',
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x2: [
							{
								parachain: 2030,
							},
							{
								generalKey: '0x0904',
							},
						],
					},
				},
			},
			asset: '272547899416482196831721420898811311297',
			contractAddress: '0xffffffffcd0ad0ea6576b7b285295c85e94cf4c1',
			source: ['2004'],
		},
		{
			paraID: 2031,
			relayChain: 'polkadot',
			nativeChainID: 'centrifuge',
			symbol: 'CFG',
			decimals: 18,
			interiorType: 'x2',
			xcmV1Standardized: [
				{
					network: 'polkadot',
				},
				{
					parachain: 2031,
				},
				{
					generalKey: '0x0001',
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x2: [
							{
								parachain: 2031,
							},
							{
								generalKey: '0x0001',
							},
						],
					},
				},
			},
			asset: '91372035960551235635465443179559840483',
			contractAddress: '0xffffffff44bd9d2ffee20b25d1cf9e78edb6eae3',
			source: ['2004'],
		},
		{
			paraID: 2032,
			relayChain: 'polkadot',
			nativeChainID: 'interlay',
			symbol: 'IBTC',
			decimals: 8,
			interiorType: 'x2',
			xcmV1Standardized: [
				{
					network: 'polkadot',
				},
				{
					parachain: 2032,
				},
				{
					generalKey: '0x0001',
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x2: [
							{
								parachain: 2032,
							},
							{
								generalKey: '0x0001',
							},
						],
					},
				},
			},
			asset: '120637696315203257380661607956669368914',
			contractAddress: '0xffffffff5ac1f9a51a93f5c527385edf7fe98a52',
			source: ['2004'],
		},
		{
			paraID: 2032,
			relayChain: 'polkadot',
			nativeChainID: 'interlay',
			symbol: 'INTR',
			decimals: 10,
			interiorType: 'x2',
			xcmV1Standardized: [
				{
					network: 'polkadot',
				},
				{
					parachain: 2032,
				},
				{
					generalKey: '0x0002',
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x2: [
							{
								parachain: 2032,
							},
							{
								generalKey: '0x0002',
							},
						],
					},
				},
			},
			asset: '101170542313601871197860408087030232491',
			contractAddress: '0xffffffff4c1cbcd97597339702436d4f18a375ab',
			source: ['2004'],
		},
		{
			paraID: 2034,
			relayChain: 'polkadot',
			nativeChainID: 'hydra',
			symbol: 'HDX',
			decimals: 12,
			interiorType: 'x2',
			xcmV1Standardized: [
				{
					network: 'polkadot',
				},
				{
					parachain: 2034,
				},
				{
					generalIndex: 0,
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x2: [
							{
								parachain: 2034,
							},
							{
								generalIndex: 0,
							},
						],
					},
				},
			},
			asset: '69606720909260275826784788104880799692',
			contractAddress: '0xffffffff345dc44ddae98df024eb494321e73fcc',
			source: ['2004'],
		},
		{
			paraID: 2035,
			relayChain: 'polkadot',
			nativeChainID: 'phala',
			symbol: 'PHA',
			decimals: 12,
			interiorType: 'x1',
			xcmV1Standardized: [
				{
					network: 'polkadot',
				},
				{
					parachain: 2035,
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x1: {
							parachain: 2035,
						},
					},
				},
			},
			asset: '132685552157663328694213725410064821485',
			contractAddress: '0xffffffff63d24ecc8eb8a7b5d0803e900f7b6ced',
			source: ['2004'],
		},
		{
			paraID: 2040,
			relayChain: 'polkadot',
			nativeChainID: null,
			symbol: 'PDEX',
			decimals: 12,
			interiorType: 'x1',
			xcmV1Standardized: [
				{
					network: 'polkadot',
				},
				{
					parachain: 2040,
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x1: {
							parachain: 2040,
						},
					},
				},
			},
			asset: '90225766094594282577230355136633846906',
			contractAddress: '0xffffffff43e0d9b84010b1b67ba501bc81e33c7a',
			source: ['2004'],
		},
		{
			paraID: 2043,
			relayChain: 'polkadot',
			nativeChainID: 'origintrail-parachain',
			symbol: 'OTP',
			decimals: 12,
			interiorType: 'x2',
			xcmV1Standardized: [
				{
					network: 'polkadot',
				},
				{
					parachain: 2043,
				},
				{
					palletInstance: 10,
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x2: [
							{
								parachain: 2043,
							},
							{
								palletInstance: 10,
							},
						],
					},
				},
			},
			asset: '238111524681612888331172110363070489924',
			contractAddress: '0xffffffffb3229c8e7657eabea704d5e75246e544',
			source: ['2004'],
		},
		{
			paraID: 2046,
			relayChain: 'polkadot',
			nativeChainID: 'darwinia',
			symbol: 'RING',
			decimals: 18,
			interiorType: 'x2',
			xcmV1Standardized: [
				{
					network: 'polkadot',
				},
				{
					parachain: 2046,
				},
				{
					palletInstance: 5,
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x2: [
							{
								parachain: 2046,
							},
							{
								palletInstance: 5,
							},
						],
					},
				},
			},
			asset: '125699734534028342599692732320197985871',
			contractAddress: '0xffffffff5e90e365edca87fb4c8306df1e91464f',
			source: ['2004'],
		},
		{
			paraID: 2092,
			relayChain: 'polkadot',
			nativeChainID: 'zeitgeist',
			symbol: 'ZTG',
			decimals: 10,
			interiorType: 'x2',
			xcmV1Standardized: [
				{
					network: 'polkadot',
				},
				{
					parachain: 2092,
				},
				{
					generalKey: '0x0001',
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x2: [
							{
								parachain: 2092,
							},
							{
								generalKey: '0x0001',
							},
						],
					},
				},
			},
			asset: '150874409661081770150564009349448205842',
			contractAddress: '0xffffffff71815ab6142e0e20c7259126c6b40612',
			source: ['2004'],
		},
		{
			paraID: 2094,
			relayChain: 'polkadot',
			nativeChainID: 'pendulum',
			symbol: 'PEN',
			decimals: 12,
			interiorType: 'x2',
			xcmV1Standardized: [
				{
					network: 'polkadot',
				},
				{
					parachain: 2094,
				},
				{
					palletInstance: 10,
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x2: [
							{
								parachain: 2094,
							},
							{
								palletInstance: 10,
							},
						],
					},
				},
			},
			asset: '45647473099451451833602657905356404688',
			contractAddress: '0xffffffff2257622f345e1acde0d4f46d7d1d77d0',
			source: ['2004'],
		},
		{
			paraID: 2101,
			relayChain: 'polkadot',
			nativeChainID: null,
			symbol: 'SUB',
			decimals: 10,
			interiorType: 'x1',
			xcmV1Standardized: [
				{
					network: 'polkadot',
				},
				{
					parachain: 2101,
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x1: {
							parachain: 2101,
						},
					},
				},
			},
			asset: '89994634370519791027168048838578580624',
			contractAddress: '0xffffffff43b4560bc0c451a3386e082bff50ac90',
			source: ['2004'],
		},
		{
			paraID: 2104,
			relayChain: 'polkadot',
			nativeChainID: null,
			symbol: 'MANTA',
			decimals: 18,
			interiorType: 'x1',
			xcmV1Standardized: [
				{
					network: 'polkadot',
				},
				{
					parachain: 2104,
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x1: {
							parachain: 2104,
						},
					},
				},
			},
			asset: '166446646689194205559791995948102903873',
			contractAddress: '0xffffffff7d3875460d4509eb8d0362c611b4e841',
			source: ['2004'],
		},
	],
};
