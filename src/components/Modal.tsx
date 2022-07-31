// Copyright (C) 2021-2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent as BaseModalContent,
    ModalFooter as BaseModalFooter,
    ModalOverlay,
    ModalContentProps,
    ModalFooterProps,
} from '@chakra-ui/react';
import React, { FC } from 'react';

const ModalContent: FC<ModalContentProps> = ({ children, ...restProps }) => (
    <BaseModalContent minHeight={610} {...restProps}>
        {children}
    </BaseModalContent>
);

const ModalFooter: FC<ModalFooterProps> = ({ children, ...restProps }) => (
    <BaseModalFooter pb="40px !important" {...restProps}>
        {children}
    </BaseModalFooter>
);

export {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalOverlay,
    ModalContent,
    ModalFooter,
};
