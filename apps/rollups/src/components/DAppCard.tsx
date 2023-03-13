// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react';
import { Address, Card, DappIcon } from '@explorer/ui';
import { useRouter } from 'next/router';
import { FC } from 'react';

export interface DAppCardProps extends BoxProps {
    address: string;
    chainId: number;
    inputCount: number;
    date: Date;
}

const DAppCard: FC<DAppCardProps> = (props) => {
    const { address, chainId, inputCount, date, ...restProps } = props;
    const router = useRouter();
    const boxShadow = useColorModeValue(
        '0px 0px 3px rgba(0, 0, 0, 0.1)',
        '0px 0px 3px rgba(255, 255, 255, 0.3)'
    );

    return (
        <Card
            {...restProps}
            key={address}
            direction="column"
            alignItems="center"
            w="auto"
            mx={{ base: 6, md: 0 }}
            title={
                <Address
                    address={address}
                    truncated
                    fontSize="xl"
                    chainId={chainId}
                />
            }
            subtitle={`${inputCount} inputs since ${date.toDateString()}`}
            titleProps={{
                justifyContent: 'center',
            }}
            iconBg="blue.100"
            icon={<Box as={DappIcon} w={8} h={8} color="blue.500" />}
            buttonText="VIEW"
            onButtonClick={() => router.push(`/dapp/${address}`)}
            contentStackProps={{
                direction: 'column',
                textAlign: 'center',
                spacing: 8,
            }}
            boxShadow={boxShadow}
        />
    );
};

export default DAppCard;
