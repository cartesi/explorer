import { BigNumber, BigNumberish } from "ethers";
import { formatEther, parseEther } from '@ethersproject/units';

export const formatCTSI = (amount: BigNumberish): string => {
    return formatEther(amount);
}

export const parseCTSI = (amount: BigNumberish): BigNumber => {
    return parseEther(amount.toString());
}
