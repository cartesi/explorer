// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FunctionComponent } from 'react';
import { Flex, FlexProps, Spacer } from '@chakra-ui/react';
import { MarketInformation } from '../../services/market';
import MarketInfo from '../MarketInfo';

export interface MarketInfoPanelProps extends FlexProps {
    market: MarketInformation;
}

const MarketInfoPanel: FunctionComponent<MarketInfoPanelProps> = (props) => {
    const { market } = props;
    return (
        <Flex direction={['column', 'row', 'row', 'row']} {...props}>
            <MarketInfo label="CTSI Price" value={market?.price} unit="USD" />
            <Spacer />
            <MarketInfo
                label="CTSI Market Cap"
                value={market?.marketCap}
                unit="USD"
            />
            <Spacer />
            <MarketInfo
                label="Circ. Supply"
                value={market?.circulatingSupply}
                unit="CTSI"
            />
        </Flex>
    );
};

export default MarketInfoPanel;
