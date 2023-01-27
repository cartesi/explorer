import { forwardRef } from '@chakra-ui/react';
import { LegacyRef } from 'react';
import { useWallet } from '@explorer/wallet';
import { useMessages } from '../../../utils/messages';
import { Notification, ConnectWallet } from '@explorer/ui';

/**
 * A warning notification when wallet is disconnected along with a connect wallet action button.
 * Show/hide should be controlled from outside with conditional rendering.
 * @returns
 */
export const WalletDisconnectedNotification = forwardRef<
    { ref?: LegacyRef<HTMLDivElement> },
    'div'
>((props, ref) => {
    const wallet = useWallet();
    return (
        <div ref={ref}>
            <Notification
                title={useMessages('wallet.is.disconnected')}
                status="warning"
            >
                <ConnectWallet wallet={wallet} />
            </Notification>
        </div>
    );
});
