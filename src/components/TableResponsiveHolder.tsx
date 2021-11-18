// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC, useEffect, useRef, useState } from 'react';
import { Box, useConst } from '@chakra-ui/react';

export const TableResponsiveHolder: FC = ({ children }) => {
    const [state, setState] = useState({
        overflow: false,
        scrolled: false,
        scrolledToRight: false,
    });

    const holder = useRef<HTMLDivElement>();

    const scrollIndicatorsStyles = useConst(() => ({
        height: '100%',
        width: '0.5rem',
        position: 'absolute',
        right: '0',
        top: '0',
        pointerEvents: 'none',
        zIndex: 2,
        transition: 'opacity 0.2s ease-in-out',
    }));

    const handleResize = () => {
        setState((prev) => {
            return {
                ...prev,
                overflow:
                    holder.current.clientWidth < holder.current.scrollWidth,
            };
        });
    };

    const handleScroll = () => {
        setState((prev) => {
            return {
                ...prev,
                scrolled: holder.current.scrollLeft > 0,
                scrolledToRight:
                    holder.current.scrollLeft +
                        holder.current.clientWidth +
                        1 >=
                    holder.current.scrollWidth,
            };
        });
    };

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        holder.current.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [holder]);

    return (
        <Box position="relative" w="100%">
            <Box overflowX="auto" w="100%" ref={holder}>
                {children}
            </Box>
            {state.overflow && (
                <>
                    <Box
                        {...scrollIndicatorsStyles}
                        background="radial-gradient(ellipse at right, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 75%) 100% center"
                        backgroundPosition="100% 0%"
                        right="0"
                        opacity={
                            state.overflow && !state.scrolledToRight ? 1 : 0
                        }
                    />
                    <Box
                        {...scrollIndicatorsStyles}
                        background="radial-gradient(ellipse at left, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 75%) 0 center"
                        backgroundPosition="0.5rem 0%"
                        left="0"
                        opacity={state.scrolled ? 1 : 0}
                    />
                </>
            )}
        </Box>
    );
};
