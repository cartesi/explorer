// Copyright (C) 2022 Cartesi Pte. Ltd.
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Box, BoxProps, Text, useColorModeValue } from '@chakra-ui/react';

export type MessageProps = { content: string; boxProps?: BoxProps };
export const Message = ({ content, boxProps }: MessageProps) => {
    const tipsBgColor = useColorModeValue('white', 'dark.gray.tertiary');

    return (
        <Box
            px={6}
            py={4}
            bgColor={tipsBgColor}
            borderRadius="6px"
            {...boxProps}
        >
            <Text>{content}</Text>
        </Box>
    );
};
