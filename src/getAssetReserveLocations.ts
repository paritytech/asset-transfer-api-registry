import { XcmV3MultiLocation } from './types';

export const getAssetReserveLocations = (
	location: string,
	chainId: number,
): string[] => {
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

	return [assetHubLocation, originChainLocation];
};

const getOriginChainLocationFromLocation = (
	location: string,
	chainId: number,
): string => {
	let originChainLocation: XcmV3MultiLocation | string = '';
	let xcmLocation: XcmV3MultiLocation | undefined = undefined;

	try {
		xcmLocation = JSON.parse(location) as XcmV3MultiLocation;
	} catch {
		throw new Error(`Unable to parse ${location} as a valid location`);
	}

	if (xcmLocation.interior?.X1) {
		originChainLocation = xcmLocation;
	} else if (xcmLocation.interior?.X2) {
		originChainLocation = {
			parents: xcmLocation.parents,
			interior: {
				X1: xcmLocation.interior.X2[0],
			},
		};
	} else if (xcmLocation.interior?.X3) {
		originChainLocation = {
			parents: xcmLocation.parents,
			interior: {
				X1: xcmLocation.interior.X3[0],
			},
		};
	} else if (xcmLocation.interior?.X4) {
		originChainLocation = {
			parents: xcmLocation.parents,
			interior: {
				X1: xcmLocation.interior.X4[0],
			},
		};
	} else if (xcmLocation.interior?.X5) {
		originChainLocation = {
			parents: xcmLocation.parents,
			interior: {
				X1: xcmLocation.interior.X5[0],
			},
		};
	} else if (xcmLocation.interior?.X6) {
		originChainLocation = {
			parents: xcmLocation.parents,
			interior: {
				X1: xcmLocation.interior?.X6[0],
			},
		};
	} else if (xcmLocation.interior?.X7) {
		originChainLocation = {
			parents: xcmLocation.parents,
			interior: {
				X1: xcmLocation.interior.X7[0],
			},
		};
	} else if (xcmLocation.interior?.X8) {
		originChainLocation = {
			parents: xcmLocation.parents,
			interior: {
				X1: xcmLocation.interior.X8[0],
			},
		};
	} else {
		throw new Error(`Unable to derive chain origin from location ${location}`);
	}

	if (
		JSON.stringify(originChainLocation.interior.X1).includes(chainId.toString())
	) {
		originChainLocation = '{"parents":"0","interior":{"Here":""}}';
	} else if (
		originChainLocation.interior.X1?.GlobalConsensus &&
		!JSON.stringify(originChainLocation.interior.X1?.GlobalConsensus)
			.toLowerCase()
			.includes('ethereum')
	) {
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
