// Copyright (C) 2022 Cartesi Pte. Ltd.
import { ethers } from 'ethers';

const PAYLOAD_STRING = '0x496d616765206e6f74206c6f61646564';
const PAYLOAD_JSON =
    '0x7b227473223a2022323032322d31302d31392031323a34353a3037222c20227470223a20312c2022647363223a20224f7574206f6620726f757465222c202264697374616e6365223a20302e32322c2022637572725f636f6f726473223a205b35392e34313337373535393338353435352c2032342e38353330353531323233393538385d2c20226275735f6c696e65223a20223135222c202274726970223a202231353b3133222c202276616c7565223a2031302e38337d';
const hexToJSON = (hex: string) => {
    const str = ethers.utils.toUtf8String(hex);
    try {
        return JSON.parse(str);
    } catch (e) {
        return false;
    }
};
describe('JSON Visual Interactive', () => {
    it('Should return the converted payload as true', () => {
        expect(hexToJSON(PAYLOAD_JSON)).toBeTruthy();
    });
    it('Should return the converted payload as false', () => {
        expect(hexToJSON(PAYLOAD_STRING)).toBeFalsy();
    });
});
