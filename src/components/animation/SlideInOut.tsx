// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { memo, FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SlideInOutProps {
    display: boolean;
}

export const SlideInOut: FC<SlideInOutProps> = memo(({ display, children }) => {
    const transition = {
        duration: 0.5,
        bounce: 0.5,
        type: 'spring',
    };

    return (
        <AnimatePresence>
            {display && (
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{
                        x: -100,
                        opacity: 0,
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
        </AnimatePresence>
    );
});
