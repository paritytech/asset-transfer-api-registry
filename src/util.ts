// Copyright 2023 Parity Technologies (UK) Ltd.

import fs from 'fs';

import type { TokenRegistry } from './types';

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
