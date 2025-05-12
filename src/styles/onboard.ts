// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { colors } from './foundations/colors';
import { zIndices } from './foundations/zIndices';

const grayColour = colors.dark.gray.quaternary.value;
const white = colors.white.value;

const LEDGER_MODAL = '.ledger-ck-modal > #ModalWrapper';

export const onboardTheme = {
    [LEDGER_MODAL]: {
        zIndex: zIndices.xxl.value,
    },
    ':root': {
        '--onboard-font-family-normal': 'var(--chakra-fonts-body)',
        '--onboard-font-family-semibold': 'var(--chakra-fonts-body)',
        '--onboard-font-family-light': 'var(--chakra-fonts-body)',
        '--onboard-modal-z-index': zIndices.xxl.value,
        '--onboard-account-select-modal-z-index': zIndices.xxl.value,
        '--onboard-link-color': colors.light.primary.value,
        '--wcm-z-index': `${1060} !important`,
        '--w3m-z-index': `${1060} !important`,
    },
    ':root.dark': {
        '--onboard-connect-sidebar-background': grayColour,
        '--onboard-connect-sidebar-color': white,
        '--onboard-connect-sidebar-progress-background': white,
        '--onboard-connect-sidebar-progress-color': grayColour,
        '--onboard-connect-header-background': grayColour,
        '--onboard-connect-header-color': white,
        '--onboard-close-button-background': grayColour,
        '--onboard-close-button-color': white,
        '--onboard-wallet-button-background-hover': colors.gray1.value,
        // Color pallet
        '--onboard-black': white,
        '--onboard-link-color': colors.dark.primary.value,
    },
};
