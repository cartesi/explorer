// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import React from 'react';
import { useNoticesQuery } from '../../generated/graphql';

type Notice = {
    epoch: number;
    input: number;
    notice: number;
    payload?: string;
};

const formatPayload = (payload: string | undefined): string => {
    if (payload) {
        try {
            return ethers.utils.toUtf8String(payload);
        } catch (e) {
            return `0x${payload}`;
        }
    } else {
        return '(empty)';
    }
};

export const Notices: React.FC = () => {
    const [result] = useNoticesQuery();
    const { data, fetching, error } = result;

    if (fetching) return <p>Loading...</p>;
    if (error)
        return (
            <Alert status="error">
                <AlertIcon />
                <AlertTitle>Error fetching notices!</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
            </Alert>
        );

    if (!data || !data.notices) return <p>No notices</p>;

    const notices: Notice[] = data.notices.nodes
        .map((n) => {
            return {
                epoch: n.input.epoch.index,
                input: n.input.index,
                notice: n.index,
                payload: n.payload,
            };
        })
        .sort((b, a) => {
            if (a.epoch === b.epoch) {
                if (a.input === b.input) {
                    return a.notice - b.notice;
                } else {
                    return a.input - b.input;
                }
            } else {
                return a.epoch - b.epoch;
            }
        });

    return (
        <table>
            <thead>
                <tr>
                    <th>Epoch</th>
                    <th>Input Index</th>
                    <th>Notice Index</th>
                    <th>Payload</th>
                </tr>
            </thead>
            <tbody>
                {notices.length === 0 && (
                    <tr>
                        <td colSpan={4}>no notices</td>
                    </tr>
                )}
                {notices.map((n) => (
                    <tr key={`${n.epoch}-${n.input}-${n.notice}`}>
                        <td>{n.epoch}</td>
                        <td>{n.input}</td>
                        <td>{n.notice}</td>
                        <td>{formatPayload(n.payload)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
