// Copyright 2023 Parity Technologies (UK) Ltd.

import fs from 'fs';
import fetch from 'node-fetch';

import { RPC_BLACK_LIST } from './consts';
import type { TokenRegistry, XcAssets } from './types';

/**
 * Write Json to a file path.
 *
 * @param path Path to write the json file too
 * @param data Data that will be written to file.
 */
export const writeJson = (path: string, data: TokenRegistry): void => {
	fs.writeFileSync(path, JSON.stringify(data, null, 2));
	fs.appendFileSync(path, '\n', 'utf-8');
};

/**
 * This create a loader for the terminal.
 */
export const twirlTimer = () => {
	const P = ['\\', '|', '/', '-'];
	let x = 0;
	return setInterval(function () {
		process.stdout.write('\r' + P[x++]);
		x &= 3;
	}, 250);
};

/**
 * Sleep utility.
 *
 * @param ms Milliseconds
 */
export const sleep = (ms: number): Promise<void> => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(), ms);
	});
};

/**
 * Determines when endpoint processing should be skipped.
 *
 * @param endpoint
 */
export const skipProcessingEndpoint = (endpoint: string): boolean => {
	if (endpoint.includes('onfinality') || RPC_BLACK_LIST.includes(endpoint)) {
		return true;
	}

	return false;
};

export const fetchXcAssetData = async (
	cdnUrl: string,
): Promise<{ xcAssets: XcAssets }> => {
	const xcAssetsRegistry = (await (await fetch(cdnUrl)).json()) as {
		xcAssets: XcAssets;
	};

	return xcAssetsRegistry;
};
