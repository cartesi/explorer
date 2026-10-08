import { mock } from 'jest-mock-extended';
import { useWagmiWallet } from '../../../src/components/wallet/useWagmiWallet';
import { ReturnOf } from '../../test-utilities';

type UseWagmiWalletReturn = ReturnOf<typeof useWagmiWallet>;

const buildUseWagmiWalletRet = () => mock<UseWagmiWalletReturn>();

function buildMockUseWagmiWalletReturn() {
    const mock = buildUseWagmiWalletRet();
    mock.active = false;
    return mock;
}

export { buildMockUseWagmiWalletReturn };
