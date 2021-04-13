import { getDefaultProvider, providers } from 'ethers';
import { tinyString } from '../utils/stringUtils';

export const getENS = async (address: string) => {
    const savedEnsStr = localStorage.getItem('ens');
    let savedEns = JSON.parse(savedEnsStr);
    if (savedEns && savedEns[address]) return savedEns[address];

    const provider = getDefaultProvider(providers.getNetwork(1), {
        infura: 'c9962a997e984fc494703ac6b99c11c5',
    });
    const ens = await provider.lookupAddress(address);
    if (ens) {
        savedEns = {
            ...savedEns,
            address: ens,
        };

        localStorage.setItem('ens', JSON.stringify(savedEns));

        return ens;
    }

    return tinyString(address);
};
