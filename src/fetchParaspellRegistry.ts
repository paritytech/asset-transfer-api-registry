// Copyright 2023 Parity Technologies (UK) Ltd.

import type { AnyJson } from '@polkadot/types/types';
import fetch from 'node-fetch';

import type { ChainName, TokenRegistry } from './types.js';

const PARASPELL_URL =
	'https://raw.githubusercontent.com/paraspell/xcm-tools/main/packages/assets/src/maps/assets.json';

export interface ParaspellAsset {
	symbol: string;
	decimals: number;
	isNative?: boolean;
	assetId?: string | number;
	existentialDeposit?: string;
	location?: AnyJson;
	alias?: string;
	isFeeAsset?: boolean;
}

export interface ParaspellNetwork {
	relaychainSymbol: string;
	nativeAssetSymbol: string;
	isEVM?: boolean;
	ss58Prefix?: number;
	supportsDryRunApi?: boolean;
	supportsXcmPaymentApi?: boolean;
	nativeAssets?: ParaspellAsset[];
	otherAssets?: ParaspellAsset[];
}

export interface ParaspellRegistry {
	[networkName: string]: ParaspellNetwork;
}

// Chain ID mapping from paraspell network names to parachain IDs
const CHAIN_ID_MAPPING: Record<string, string> = {
	// Polkadot relay chain
	Polkadot: '0',
	AssetHubPolkadot: '1000',
	BridgeHubPolkadot: '1002',
	Collectives: '1001',
	PeoplePolkadot: '1004',
	CoretimePolkadot: '1005',

	// Polkadot parachains
	Acala: '2000',
	Clover: '2002',
	Moonbeam: '2004',
	Astar: '2006',
	Equilibrium: '2011',
	Parallel: '2012',
	Litentry: '2013',
	ComposableFinance: '2019',
	Efinity: '2021',
	Nodle: '2026',
	BifrostPolkadot: '2030',
	Centrifuge: '2031',
	Interlay: '2032',
	HydraDX: '2034',
	Hydration: '2034', // Same as HydraDX
	Phala: '2035',
	Unique: '2037',
	Polkadex: '2040',
	OriginTrail: '2043',
	Darwinia: '2046',
	Crust: '2008',
	Subsocial: '2101',
	Zeitgeist: '2092',
	Manta: '2104',
	NeuroWeb: '2043', // Same as OriginTrail
	Pendulum: '2094',
	Ajuna: '2051',
	Polimec: '3344',
	Mythos: '3369',
	Peaq: '3338',
	EnergyWebX: '3359',
	Laos: '3370',

	// Kusama relay chain
	Kusama: '0',
	AssetHubKusama: '1000',
	Statemine: '1000', // Old name for AssetHubKusama
	BridgeHubKusama: '1002',
	PeopleKusama: '1004',
	CoretimeKusama: '1005',

	// Kusama parachains
	Karura: '2000',
	BifrostKusama: '2001',
	Khala: '2004',
	Shiden: '2007',
	CrustShadow: '2012',
	Moonriver: '2023',
	Robonomics: '2048',
	RobonomicsKusama: '2048',
	Quartz: '2095',
	Basilisk: '2090',
	Altair: '2088',
	Kintsugi: '2092',
	Picasso: '2087',
	Calamari: '2084',
	Amplitude: '2124',
	Turing: '2114',
	Litmus: '2106',
	Crab: '2105',
	IntegriteeKusama: '2015',
	Encointer: '1001',
	Curio: '2090', // Same as Basilisk
	Heima: '2104',
	KiltSpiritnet: '2086',

	// System chains for Westend (if needed)
	Westend: '0',
	AssetHubWestend: '1000',
	BridgeHubWestend: '1002',
	CollectivesWestend: '1001',
	CoretimeWestend: '1005',
	PeopleWestend: '1004',

	// System chains for Paseo (if needed)
	Paseo: '0',
	AssetHubPaseo: '1000',
	BridgeHubPaseo: '1002',
	CoretimePaseo: '1005',
	PeoplePaseo: '1004',
};

function getParachainId(networkName: string): string | null {
	if (CHAIN_ID_MAPPING[networkName]) {
		return CHAIN_ID_MAPPING[networkName];
	}

	console.warn(`Unknown network: ${networkName}`);
	return null;
}

function getRelayChain(
	networkName: string,
	paraspellData: ParaspellRegistry,
): ChainName | null {
	// Check if network exists in the data to determine relay chain
	if (paraspellData[networkName]) {
		const network = paraspellData[networkName];
		if (network.relaychainSymbol === 'DOT') return 'polkadot';
		if (network.relaychainSymbol === 'KSM') return 'kusama';
		if (network.relaychainSymbol === 'WND') return 'westend';
		if (network.relaychainSymbol === 'PAS') return 'paseo';
	}

	// Fallback based on network name patterns
	if (
		networkName.toLowerCase().includes('kusama') ||
		[
			'Karura',
			'Moonriver',
			'Shiden',
			'BifrostKusama',
			'Altair',
			'Basilisk',
			'Calamari',
			'CrustShadow',
			'Khala',
			'Kico',
			'Kintsugi',
			'Picasso',
			'Quartz',
			'Robonomics',
			'RobonomicsKusama',
			'Turing',
		].includes(networkName)
	) {
		return 'kusama';
	}

	if (
		networkName.toLowerCase().includes('westend') ||
		networkName === 'Westend'
	) {
		return 'westend';
	}

	if (networkName.toLowerCase().includes('paseo') || networkName === 'Paseo') {
		return 'paseo';
	}

	return 'polkadot'; // Default to polkadot
}

function transformParaspellToRegistry(
	paraspellData: ParaspellRegistry,
	currentRegistry: TokenRegistry,
): TokenRegistry {
	const newRegistry = JSON.parse(
		JSON.stringify(currentRegistry),
	) as TokenRegistry;

	for (const [networkName, networkData] of Object.entries(paraspellData)) {
		const relayChain = getRelayChain(networkName, paraspellData);
		const parachainId = getParachainId(networkName);

		if (!parachainId || !relayChain || !newRegistry[relayChain]) {
			console.log(
				`Skipping ${networkName} - no parachain ID mapping or relay chain`,
			);
			continue;
		}

		// Initialize parachain entry if it doesn't exist
		if (!newRegistry[relayChain][parachainId]) {
			newRegistry[relayChain][parachainId] = {
				tokens: [],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: networkName.toLowerCase(),
			};
		}

		const chainEntry = newRegistry[relayChain][parachainId];

		// Process native assets
		if (networkData.nativeAssets) {
			for (const asset of networkData.nativeAssets) {
				if (asset.symbol && !chainEntry.tokens.includes(asset.symbol)) {
					chainEntry.tokens.push(asset.symbol);
				}
			}
		}

		// Process other assets
		if (networkData.otherAssets) {
			for (const asset of networkData.otherAssets) {
				if (asset.assetId && asset.symbol) {
					const assetIdStr = asset.assetId.toString();
					chainEntry.assetsInfo[assetIdStr] = asset.symbol;

					// If asset has location data, add to foreignAssetsInfo
					if (asset.location) {
						chainEntry.foreignAssetsInfo[assetIdStr] = {
							symbol: asset.symbol,
							name: asset.symbol,
							multiLocation: JSON.stringify(asset.location),
							assetHubReserveLocation: JSON.stringify(asset.location),
							originChainReserveLocation: JSON.stringify(asset.location),
						};
					}
				}
			}
		}
	}

	return newRegistry;
}

/**
 * Fetches Paraspell asset registry data and integrates it into the token registry
 */
export const fetchParaspellRegistryInfo = async (
	registry: TokenRegistry,
): Promise<TokenRegistry> => {
	try {
		console.log('Fetching Paraspell assets data...');

		const response = await fetch(PARASPELL_URL);
		const paraspellData = (await response.json()) as ParaspellRegistry;

		console.log('Transforming Paraspell data...');
		const updatedRegistry = transformParaspellToRegistry(
			paraspellData,
			registry,
		);

		console.log('Paraspell registry integration completed successfully');
		return updatedRegistry;
	} catch (error) {
		console.error('Error fetching Paraspell registry:', error);
		console.warn('Continuing with existing registry data');
		return registry;
	}
};
