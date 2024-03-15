// Copyright 2023 Parity Technologies (UK) Ltd.

import { formatDate } from '@polkadot/util';
import fs from 'fs';
import fetch from 'node-fetch';

import { RPC_BLACK_LIST } from './consts.js';
import type { TokenRegistry, XcAssets } from './types.js';

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
		process.stdout.write('\r');
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

/** Formats a string to match the output of polkadot-js logging.
 *
 * @param log String to be logged
 * @param remove Remove lines before that were cleared by std
 */
export const logWithDate = (log: string, remove?: boolean) => {
	remove
		? console.log(`\r${formatDate(new Date())}          ${log}`)
		: console.log(`${formatDate(new Date())}          ${log}`);
};
