import casual from 'casual';
import { ethers } from 'ethers';

const BigInt = () => casual.integer(0, Number.MAX_SAFE_INTEGER);

const Int = () => casual.integer(0, 1000);

const Float = () => casual.integer(0, Number.MAX_SAFE_INTEGER);

const String = () =>
    ethers.utils.hexlify(ethers.utils.toUtf8Bytes(casual.words(5)));
export { BigInt, Int, Float, String };
