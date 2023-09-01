// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import { BoxProps, useColorModeValue } from '@chakra-ui/react';
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
    const bg = useColorModeValue('white', 'dark.gray.tertiary');
    const borderColor = useColorModeValue(
        'dark.border.tertiary',
        'dark.gray.quaternary'
    );
    const iconColor = useColorModeValue('light.primary', 'dark.primary');
    const iconBg = useColorModeValue('dark.gray.senary', 'dark.gray.primary');

    return (
        <Card
            {...restProps}
            key={address}
            direction="column"
            alignItems="center"
            w="auto"
            bg={bg}
            borderWidth="1px"
            borderRadius="1rem"
            borderColor={borderColor}
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
            iconBg={iconBg}
            icon={<DappIcon w={8} h={8} color={iconColor} />}
            buttonText="VIEW"
            onButtonClick={() => router.push(`/dapp/${address}`)}
            contentStackProps={{
                direction: 'column',
                textAlign: 'center',
                spacing: 8,
            }}
        />
    );
};

export default DAppCard;
