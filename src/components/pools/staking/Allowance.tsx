// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';
import {
    HStack,
    IconButton,
    Input,
    Text,
    Tooltip,
    useDisclosure,
} from '@chakra-ui/react';
import { BigNumber, BigNumberish } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { FC, useState } from 'react';
import { MdVerticalAlignTop } from 'react-icons/md';
import CTSI from './CTSI';
import Title from './Title';

export interface AllowanceProps {
    allowance: BigNumber;
    futureAllowance?: BigNumber;
    onApprove: (value: BigNumberish) => void;
}

const Allowance: FC<AllowanceProps> = ({
    allowance,
    futureAllowance,
    onApprove,
}) => {
    const disclosure = useDisclosure();

    const modified = futureAllowance && !futureAllowance.eq(allowance);

    // formatter for CTSI values
    const numberFormat = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });

    // initialize allowance to current allowance
    const [newAllowance, setNewAllowance] = useState<string>(
        numberFormat.format(parseFloat(formatUnits(allowance, 18)))
    );

    return (
        <HStack justify="space-between">
            <Title
                title="Allowance"
                icon={<MdVerticalAlignTop />}
                help="Maximum amount of tokens this pool can transfer out of your wallet"
            />
            <HStack align="baseline">
                {!disclosure.isOpen && modified && (
                    <CTSI value={futureAllowance} />
                )}
                {!disclosure.isOpen && (
                    <CTSI
                        value={allowance}
                        color={modified ? 'red' : undefined}
                        textDecoration={modified ? 'line-through' : undefined}
                    />
                )}
                {disclosure.isOpen && (
                    <Input
                        fontSize="3xl"
                        textAlign="right"
                        autoFocus
                        value={newAllowance}
                        onChange={(e) => setNewAllowance(e.target.value)}
                    />
                )}
                <Text fontSize="small">CTSI</Text>
                <HStack minW={100}>
                    {disclosure.isOpen || (
                        <Tooltip label="Edit" placement="top">
                            <IconButton
                                icon={<EditIcon />}
                                aria-label="Edit"
                                size="md"
                                onClick={disclosure.onToggle}
                            />
                        </Tooltip>
                    )}
                    {disclosure.isOpen && (
                        <Tooltip label="Save" placement="top">
                            <IconButton
                                icon={<CheckIcon />}
                                aria-label="Save"
                                size="md"
                                onClick={() => {
                                    onApprove(parseUnits(newAllowance, 18));
                                    disclosure.onClose();
                                }}
                            />
                        </Tooltip>
                    )}
                    {disclosure.isOpen && (
                        <Tooltip label="Cancel" placement="top">
                            <IconButton
                                icon={<CloseIcon />}
                                aria-label="Cancel"
                                size="md"
                                onClick={disclosure.onClose}
                            />
                        </Tooltip>
                    )}
                </HStack>
            </HStack>
        </HStack>
    );
};

export default Allowance;
