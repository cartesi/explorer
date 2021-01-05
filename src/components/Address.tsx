// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import ReactTooltip from 'react-tooltip';

import { etherscanLinks } from '../utils/networks';

interface AddressProps {
    id: string;
    type: string;
    className?: string;
    children: React.ReactNode;
    rawLink?: boolean;
}

const Address = ({
    id,
    type,
    className,
    children,
    rawLink = false,
}: AddressProps) => {
    const { chainId } = useWeb3React<Web3Provider>();

    const copyToClipboard = () => {
        var dummy = document.createElement('textarea');
        document.body.appendChild(dummy);
        dummy.value = id;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
    };

    if (!chainId || etherscanLinks[chainId]) {
        if (rawLink) {
            return (
                <span className={`${className} address`}>
                    <a
                        href={`${etherscanLinks[chainId || 1]}/${type}/${id}`}
                        className="address-link ml-3"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {children}
                    </a>
                </span>
            );
        }

        return (
            <>
                <span className={`${className} address`}>
                    {children}

                    <a
                        href={`${etherscanLinks[chainId || 1]}/${type}/${id}`}
                        className="address-link ml-3"
                        target="_blank"
                        rel="noopener noreferrer"
                        data-tip="View on Etherscan"
                    >
                        <i className="fas fa-external-link-alt"></i>
                    </a>
                    <span
                        className="address-link ml-1"
                        onClick={copyToClipboard}
                        data-tip="Copy to Clipboard"
                    >
                        <i className="far fa-copy"></i>
                    </span>
                </span>
                <ReactTooltip />
            </>
        );
    }

    return <span className={className}>{children}</span>;
};
export default Address;
