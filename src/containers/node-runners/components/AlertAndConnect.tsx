// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Alert, Box, Button, Icon, useColorModeValue } from '@chakra-ui/react';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { SlideDown } from '../../../components/animation/SlideDown';

interface AlertAndConnectProps {
    isVisible: boolean;
    onConnect: () => void;
}

const AlertAndConnect = ({ isVisible, onConnect }: AlertAndConnectProps) => {
    const bg = useColorModeValue('white', 'gray.800');
    return (
        <SlideDown display={isVisible}>
            <Box
                bg={bg}
                id="alert-and-wallet-connection-box"
                alignItems="center"
                display="flex"
                flexDirection="column"
                pt={12}
                pb={6}
            >
                <Box>
                    <Alert bg="transparent">
                        <Icon
                            as={AiOutlineExclamationCircle}
                            h={5}
                            w={5}
                            mr={2}
                        />
                        Please connect your wallet if you have created your own
                        node and pool already
                    </Alert>
                </Box>
                <Button colorScheme="blue" mt={7} onClick={onConnect}>
                    CONNECT WALLET
                </Button>
            </Box>
        </SlideDown>
    );
};

export default AlertAndConnect;
