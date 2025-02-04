import { isFunction } from 'lodash/fp';
import { useWallet } from '../../../src/components/wallet/useWallet';

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
