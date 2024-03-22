import { ChainInfo, ChainInfoKeys, TokenRegistry } from './types';

export const updateRegistryChainInfo = async (
	chainName: string,
	registry: TokenRegistry,
	chainInfoPromises: Promise<[ChainInfoKeys, number | undefined] | null>[],
): Promise<TokenRegistry> => {
	await Promise.all(chainInfoPromises).then((chainInfoData) => {
		for (const chainInfo of chainInfoData) {
			if (chainInfo) {
				const [info, paraId] = chainInfo;
				(registry[chainName] as ChainInfo)[paraId as number] = info;
			}
		}
	});

	return registry;
};
