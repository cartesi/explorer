// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { colors } from './foundations/colors';
import { fonts } from './foundations/fonts';
import { zIndices } from './foundations/zIndices';

const CUSTOM_CLASS = '.bn-onboard-custom';
const MODAL = `${CUSTOM_CLASS}.bn-onboard-modal`;
const MODAL_CONTENT = `${CUSTOM_CLASS}.bn-onboard-modal-content`;
const DARK_MODE = '.bn-onboard-dark-mode';
const ACCOUNT_SELECT = `${CUSTOM_CLASS}.bn-onboard-account-select`;
const ACCOUNT_SELECT_LOAD_MORE = `${ACCOUNT_SELECT} + button`;
const WALLET_CHECK_SECTION = `${CUSTOM_CLASS}.bn-onboard-wallet-check-section`;
const WALLET_CHECK_SECTION_WRAPPER = `${WALLET_CHECK_SECTION} > div`;

export const onboardTheme = {
    [MODAL]: {
        fontFamily: fonts.body.value,
        zIndex: zIndices.lg.value,
    },
    [`${MODAL_CONTENT}${DARK_MODE}`]: {
        background: colors.gray[800].value,
    },
    [WALLET_CHECK_SECTION_WRAPPER]: {
        width: '100%',
    },
    [ACCOUNT_SELECT]: {
        maxWidth: '81%',
        backgroundColor: {
            base: 'white',
            _dark: 'gray.800',
        },
    },
    [ACCOUNT_SELECT_LOAD_MORE]: {
        display: 'inline-block !important',
        flexGrow: 1,
        height: '2.5rem !important',
    },
};
