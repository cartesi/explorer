import { getDefaultProvider, providers } from 'ethers';

export const getENS = async (address: string) => {
    const savedEnsStr = localStorage.getItem('ens');
    const savedEns = JSON.parse(savedEnsStr);
    if (savedEns && savedEns[address]) return savedEns[address];

    const provider = getDefaultProvider(providers.getNetwork(1), {
        infura: 'c9962a997e984fc494703ac6b99c11c5',
    });
    const ens = await provider.lookupAddress(address);
    console.log('ens', provider, ens);
    savedEns[address] = ens;

    localStorage.setItem('ens', JSON.stringify(savedEns));

    return ens;
};
