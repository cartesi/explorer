import React from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { etherscanLinks } from '../utils/networks';

interface EtherscanLinkProps {
    id: string;
    type: string;
    className?: string;
    children: React.ReactNode;
}

const EtherscanLink = ({
    id,
    type,
    className,
    children,
}: EtherscanLinkProps) => {
    const { chainId } = useWeb3React<Web3Provider>();
    if (etherscanLinks[chainId]) {
        return (
            <a
                className={`etherscan-link ${className}`}
                href={`${etherscanLinks[chainId]}/${type}/${id}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                {children}
            </a>
        );
    }

    return <span className={className}>{children}</span>;
};
export default EtherscanLink;
