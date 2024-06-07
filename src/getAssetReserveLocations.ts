// Copyright 2024 Parity Technologies (UK) Ltd.

import type { AnyJson } from '@polkadot/types/types';

import {
	AnyObj,
	RequireOnlyOne,
	XcmV3Junctions,
	XcmV3MultiLocation,
} from './types';

/**
 * Returns the relative AssetHub and origin chain reserve locations of an asset location.
 * Returns only the AssetHub location if the origin chain is AssetHub.
 *
 * @param location
 * @param chainId
 */
export const getAssetReserveLocations = (
	location: string | AnyJson,
	chainId: number,
): [string, string | undefined] => {
	const assetHubLocation =
		chainId === 0
			? `{"parents":"0","interior":{"X1":{"Parachain":"1000"}}}`
			: chainId === 1000
			  ? `{"parents":"0","interior":{"Here":""}}`
			  : `{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}`;

	const originChainLocation = getOriginChainLocationFromLocation(
		location,
		chainId,
	);

	if (assetHubLocation === originChainLocation) {
		return [assetHubLocation, undefined];
	}

	return [assetHubLocation, originChainLocation];
};

/**
 * Returns the relative origin chain reserve location of an asset location.
 *
 * @param location
 * @param chainId
 */
const getOriginChainLocationFromLocation = (
	location: string | AnyJson,
	chainId: number,
): string => {
	const locationStr =
		typeof location === 'string'
			? location
			: JSON.stringify(sanitizeXcAssetLocationJSON(location?.['v1']));

	let originChainLocation: XcmV3MultiLocation | string = '';
	let xcmLocation: XcmV3MultiLocation | undefined = undefined;

	try {
		xcmLocation = JSON.parse(locationStr) as XcmV3MultiLocation;
	} catch {
		throw new Error(
			`Unable to parse ${JSON.stringify(location)} as a valid location`,
		);
	}

	const parents: number | undefined = xcmLocation?.parents
		? xcmLocation?.parents
		: xcmLocation?.['Parents']
		  ? (xcmLocation['Parents'] as number)
		  : undefined;
	const interior:
		| RequireOnlyOne<XcmV3Junctions, keyof XcmV3Junctions>
		| undefined = xcmLocation?.interior
		? xcmLocation?.interior
		: xcmLocation?.['Interior']
		  ? (xcmLocation['Interior'] as RequireOnlyOne<
					XcmV3Junctions,
					keyof XcmV3Junctions
		    >)
		  : undefined;

	if (!interior || !parents) {
		throw new Error(
			`Invalid xcm location for location ${JSON.stringify(xcmLocation)}`,
		);
	}

	if (interior?.X1) {
		originChainLocation = {
			parents,
			interior: {
				X1: interior.X1,
			},
		};
	} else if (interior?.X2) {
		originChainLocation = {
			parents,
			interior: {
				X1: interior.X2[0],
			},
		};
	} else if (interior?.X3) {
		originChainLocation = {
			parents,
			interior: {
				X1: interior.X3[0],
			},
		};
	} else if (interior?.X4) {
		originChainLocation = {
			parents,
			interior: {
				X1: interior.X4[0],
			},
		};
	} else if (interior?.X5) {
		originChainLocation = {
			parents,
			interior: {
				X1: interior.X5[0],
			},
		};
	} else if (interior?.X6) {
		originChainLocation = {
			parents,
			interior: {
				X1: interior?.X6[0],
			},
		};
	} else if (interior?.X7) {
		originChainLocation = {
			parents,
			interior: {
				X1: interior.X7[0],
			},
		};
	} else if (interior?.X8) {
		originChainLocation = {
			parents,
			interior: {
				X1: interior.X8[0],
			},
		};
	} else if (interior?.Here === '' || interior?.Here === null) {
		originChainLocation = xcmLocation;
	} else {
		throw new Error(
			`Unable to derive chain origin from location ${JSON.stringify(location)}`,
		);
	}

	const originIsCurrentChain =
		originChainLocation.interior?.Here === undefined &&
		originChainLocation.interior?.X1 &&
		JSON.stringify(originChainLocation.interior?.X1).includes(
			chainId.toString(),
		);

	const isNonEthereumGlobalConsensusLocation =
		originChainLocation.interior?.X1 != undefined &&
		originChainLocation.interior?.X1?.GlobalConsensus != undefined &&
		!JSON.stringify(originChainLocation.interior.X1?.GlobalConsensus)
			.toLowerCase()
			.includes('ethereum');

	if (originIsCurrentChain) {
		originChainLocation = '{"parents":"0","interior":{"Here":""}}';
	} else if (isNonEthereumGlobalConsensusLocation) {
		originChainLocation = `{"parents":${JSON.stringify(
			originChainLocation.parents,
		)},"interior":{"X2":[${JSON.stringify(
			originChainLocation.interior.X1,
		)},{"Parachain":"1000"}]}}`;
	} else {
		originChainLocation = JSON.stringify(originChainLocation);
	}

	return originChainLocation;
};

/**
 * Set all keys in a location object with the first key being capitalized.
 * When a keys value is an integer it will convert that integer into a string.
 * If a keys value is null it will return an empty string in its place.
 *
 * @param xcAssetLocationJSON
 */
const sanitizeXcAssetLocationJSON = <T extends AnyObj>(
	xcAssetLocationJSON: T,
): T => {
	const sanitizedJSON = {};

	return Object.keys(xcAssetLocationJSON).reduce((_, key) => {
		let value: unknown;

		if (xcAssetLocationJSON[key] === null) {
			value = '';
		} else {
			value = xcAssetLocationJSON[key];
		}

		if (typeof value === 'string' && value.length > 0) {
			value = value[0].toUpperCase() + value.slice(1);
		} else if (typeof value === 'number') {
			value = value.toString();
		} else if (typeof value === 'object') {
			value = sanitizeXcAssetLocationJSON(value as T);
		}

		sanitizedJSON[key[0].toUpperCase() + key.slice(1)] = value;

		return sanitizedJSON as T;
	}, {} as T);
};
