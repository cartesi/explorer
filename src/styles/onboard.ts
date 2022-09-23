// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { colors } from './foundations/colors';

const grayColour = colors.gray[800];
const white = colors.white;

export const buildOnboardTheme = (props) => {
    const isDarkMode = props.colorMode === 'dark';
    const defaultVars = {
        '--onboard-font-family-normal': 'var(--chakra-fonts-body)',
        '--onboard-font-family-semibold': 'var(--chakra-fonts-body)',
        '--onboard-font-family-light': 'var(--chakra-fonts-body)',
        '--onboard-modal-z-index': 999,
    };
    let darkVars = {};

    if (isDarkMode) {
        darkVars = {
            '--onboard-connect-sidebar-background': grayColour,
            '--onboard-connect-sidebar-color': white,
            '--onboard-connect-sidebar-progress-background': white,
            '--onboard-connect-sidebar-progress-color': grayColour,
            '--onboard-connect-header-background': grayColour,
            '--onboard-connect-header-color': white,
            '--onboard-close-button-background': grayColour,
            '--onboard-close-button-color': white,
            '--onboard-wallet-button-background-hover': colors.gray1,
            // Color pallete
            '--onboard-black': white,
        };
    }

    return {
        ':root': {
            ...defaultVars,
            ...darkVars,
        },
    };
};
