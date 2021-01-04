// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import NavBar from './NavBar';
import Footer from './Footer';

const LayoutComponent = ({ children, className = '' }) => {
    const { error } = useWeb3React();
    const isUnsupportedChainIdError = error instanceof UnsupportedChainIdError;

    return (
        <div
            className={`layout container-fluid ${className}`}
            style={{ minHeight: '100vh' }}
        >
            <NavBar />
            <div>
                {!isUnsupportedChainIdError && (
                    <div className="layout-content">{children}</div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default LayoutComponent;
