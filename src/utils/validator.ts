import { ethers } from 'ethers';

export const isEthAddress = (address: string) => {
    if (!address) return false;

    try {
        ethers.utils.getAddress(address);
        return true;
    } catch (err) {
        return false;
    }
};
