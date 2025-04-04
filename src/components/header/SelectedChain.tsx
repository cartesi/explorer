// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { TagRootProps } from '@chakra-ui/react';
import { FC } from 'react';
import { useWallet } from '../wallet/useWallet';
import Chain from './Chain';

export interface SelectedChainProps extends TagRootProps {
    showMainnet?: boolean;
}

export const SelectedChain: FC<SelectedChainProps> = ({
    showMainnet = false,
    ...tagProps
}) => {
    // get chain from context, undefined if not connected
    const { chainId } = useWallet();

    // render component
    return <Chain chainId={chainId} showMainnet={showMainnet} {...tagProps} />;
};
