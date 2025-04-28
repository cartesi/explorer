// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

const CHAKRA_FORM_CLASS = '.chakra-form';
const LABEL = `${CHAKRA_FORM_CLASS}__label`;
const ERROR_MESSAGE = `${CHAKRA_FORM_CLASS}__error-message`;
const HELPER_TEXT = `${CHAKRA_FORM_CLASS}__helper-text`;

export const formsTheme = {
    [LABEL]: {
        marginBottom: '0.75rem !important',
    },
    [ERROR_MESSAGE]: {
        marginTop: '0.75rem !important',
    },
    [HELPER_TEXT]: {
        marginTop: '0.75rem !important',
    },
};
