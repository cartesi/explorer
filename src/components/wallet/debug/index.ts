// Copyright (C) 2026 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

/**
 * Wallet debug overlay (?walletDebug=1). Self-contained: nothing outside this
 * folder depends on it beyond the mount in Web3Container.
 */
export { isWalletDebugEnabled } from './walletDebugFlag';
export { installWalletDebugCapture } from './walletDebugLog';
