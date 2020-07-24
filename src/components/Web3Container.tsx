// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useEffect, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import Web3Context from './Web3Context';

const Web3Container = ({ children }) => {
    const [provider, setProvider] = useState<Web3Provider>(undefined);
    useEffect(() => {
        setProvider(new Web3Provider(window.ethereum));
    }, []);

    return (
        <div>
            <Web3Context.Provider value={provider}>
                {children}
            </Web3Context.Provider>
        </div>
    );
};

export default Web3Container;
