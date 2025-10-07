// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { AnimatePresence, motion, Transition } from 'framer-motion';
import React, { FC, memo } from 'react';

export interface SlideDownProps {
    children: React.ReactNode;
    display: boolean;
}

export const SlideDown: FC<SlideDownProps> = memo(({ display, children }) => {
    const Component = AnimatePresence as FC<{
        children: React.ReactNode;
    }>;
    const transition: Transition = {
        duration: 0.5,
        bounce: 0.5,
        type: 'spring',
    };

    return (
        <Component>
            {display && (
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{
                        overflow: 'hidden',
                        height: 0,
                        transition: {
                            type: 'tween',
                            ease: 'anticipate',
                            duration: 0.5,
                        },
                    }}
                    transition={transition}
                >
                    {children}
                </motion.div>
            )}
        </Component>
    );
});
