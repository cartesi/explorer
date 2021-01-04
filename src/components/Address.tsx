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
}

const Address = ({ id, type, className, children }: AddressProps) => {
    const { chainId } = useWeb3React<Web3Provider>();
    if (!chainId || etherscanLinks[chainId]) {
        return (
            <>
                <span
                    className={className}
                    data-html={true}
                    data-offset="{ 'top': -15 }"
                    data-tip={`
                        <div class="body-text-2">
                            <div>${id}</div>
                            <div class="address mt-1">
                                <a href="${
                                    etherscanLinks[chainId || 1]
                                }/${type}/${id}}"
                                    class="address-link"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View on Etherscan
                                </a>
                                <span class="address-link pl-3"
                                    onclick="(function() {
                                        var dummy = document.createElement('textarea');
                                        document.body.appendChild(dummy);
                                        dummy.value = '${id}';
                                        dummy.select();
                                        document.execCommand('copy');
                                        document.body.removeChild(dummy);
                                    })()"
                                >
                                    Copy to Clipboard
                                </span>
                            </div>
                        </div>
                    `}
                >
                    {children}
                </span>
                <ReactTooltip
                    clickable={true}
                    delayShow={0}
                    delayHide={0}
                    delayUpdate={0}
                    arrowColor="#0000"
                />
            </>
        );
    }

    return <span className={className}>{children}</span>;
};
export default Address;
