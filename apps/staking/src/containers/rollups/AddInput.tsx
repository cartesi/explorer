// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import React, { FC, useState } from 'react';
import { ethers } from 'ethers';
import {
    Button,
    HStack,
    Input,
    InputGroup,
    InputLeftAddon,
} from '@chakra-ui/react';
import { useRollups } from '../../services/rollups/useRollups';

interface Props {
    address: string;
}

export const AddInput: FC<Props> = ({ address }) => {
    const rollups = useRollups(address);
    const addInput = (str: string) => {
        if (rollups) {
            rollups.inputContract.addInput(ethers.utils.toUtf8Bytes(str));
        }
    };
    const [input, setInput] = useState<string>('');

    return (
        <HStack>
            <InputGroup>
                <InputLeftAddon children="Input: " />
                <Input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
            </InputGroup>
            <Button onClick={() => addInput(input)} disabled={!rollups}>
                Send
            </Button>
        </HStack>
    );
};
