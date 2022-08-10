// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { FC, useEffect, useRef, useState } from 'react';
import {
    Button,
    Box,
    Modal,
    ModalHeader,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalOverlay,
} from '@chakra-ui/react';
import createPersistedState from 'use-persisted-state';

export interface TermsConditionProps {
    persistanceKey: string;
}

const TermsCondition: FC<TermsConditionProps> = ({ persistanceKey }) => {
    // persistent state of user read disclaimer message, stored in browser localStorage
    const useDisclaimerState = createPersistedState(persistanceKey);
    const [accepted, setAccepted] = useDisclaimerState(false);

    // control if user scrolled to bottom of text
    const [scrolled, setScrolled] = useState(true);

    const iframeRef = useRef(null);

    const handleScroll = (e: any) => {
        const elem = e.target.scrollingElement;
        const bottom = elem.scrollHeight - elem.scrollTop === elem.clientHeight;
        setScrolled(bottom || scrolled);
    };

    useEffect(() => {
        if (iframeRef && iframeRef.current) {
            iframeRef.current.contentWindow.addEventListener(
                'scroll',
                handleScroll
            );
        }
        return () => {
            if (iframeRef && iframeRef.current) {
                iframeRef.current.contentWindow.removeEventListener(
                    'scroll',
                    handleScroll
                );
            }
        };
    }, [handleScroll]);

    return (
        <Modal
            isOpen={!accepted}
            onClose={() => setAccepted(true)}
            closeOnOverlayClick={false}
            closeOnEsc={false}
            blockScrollOnMount={true}
            size="4xl"
            isCentered
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Terms and Conditions</ModalHeader>
                <ModalBody>
                    <Box
                        ref={iframeRef}
                        as="iframe"
                        h="60vh"
                        w="100%"
                        src="static/terms-and-conditions.html"
                        sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                    ></Box>
                </ModalBody>
                <ModalFooter>
                    <Button
                        colorScheme="blue"
                        isDisabled={!scrolled}
                        mr={3}
                        onClick={() => setAccepted(true)}
                    >
                        Accept
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default TermsCondition;
