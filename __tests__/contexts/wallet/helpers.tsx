import { Subscriptions } from 'bnc-onboard/dist/src/interfaces';
import { isFunction } from 'lodash/fp';
import { useWallet } from '../../../src/contexts/wallet';
import { Network } from '../../../src/utils/networks';

/**
 * Helper test component to support testing the provider.
 * @returns
 */
export const TestComponent = () => {
    const {
        active,
        activate,
        deactivate,
        isHardwareWallet,
        isGnosisSafe,
        walletType,
        account,
        chainId,
        walletName,
        error,
        library,
    } = useWallet();
    return (
        <div>
            {active && <span>Wallet is connected</span>}
            {library && <span>Ethers library is set</span>}
            {active && isFunction(deactivate) && (
                <button type="button" onClick={deactivate}>
                    Disconnect Wallet
                </button>
            )}
            {!active && <span>Wallet is not connected</span>}
            {!active && isFunction(activate) && (
                <button type="button" onClick={activate}>
                    Connect Wallet
                </button>
            )}
            {isHardwareWallet && <span>Wallet is hardware type</span>}
            {isGnosisSafe && <span>Wallet is Gnosis Safe</span>}
            {account && <span>account is: {account}</span>}
            {chainId && <span>chainId is: {chainId}</span>}
            {walletName && <span>wallet name is: {walletName}</span>}
            {walletType && <span>wallet type is: {walletType}</span>}
            {error && (
                <div>
                    <span>Error: {error.name}</span>
                    <span>{error.message}</span>
                </div>
            )}
        </div>
    );
};

type WalletName = 'Metamask' | 'Ledger' | 'WalletConnect' | 'Gnosis Safe';
interface EmulateForProps {
    name: WalletName;
    account: string;
    subscriptions: Subscriptions;
    chainId?: number;
}

const validAccount = '0x907eA0e65Ecf3af503007B382E1280Aeb46104ad';

export const emulateFor = ({
    name,
    subscriptions,
    account = validAccount,
    chainId = Network.MAINNET,
}: EmulateForProps) => {
    const { wallet, network, address } = subscriptions;
    switch (name) {
        case 'Metamask':
            wallet({
                name: 'Metamask',
                type: 'injected',
                provider: jest.fn(),
                icons: {},
            });
            break;
        case 'Ledger':
            wallet({
                name: 'Ledger',
                type: 'hardware',
                provider: jest.fn(),
                icons: {},
            });
            break;
        case 'WalletConnect':
            wallet({
                name: 'WalletConnect',
                type: 'sdk',
                provider: jest.fn(),
                icons: {},
            });
            break;
        case 'Gnosis Safe':
            wallet({
                name: 'Gnosis Safe',
                type: 'sdk',
                provider: jest.fn(),
                icons: {},
            });
            break;
        default:
            throw new Error(
                `name: ${name} not supported: [Ledger, Metamask, WalletConnect] are supported`
            );
    }
    network(chainId);
    address(account);
};
