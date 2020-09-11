import { BigNumber } from "ethers";
import { formatEther, parseEther } from '@ethersproject/units';

export const formatCTSI = (amount: BigNumber): number => {
    return parseFloat(formatEther(amount));
}

export const parseCTSI = (amount: number): BigNumber => {
    return parseEther(amount.toString());
}