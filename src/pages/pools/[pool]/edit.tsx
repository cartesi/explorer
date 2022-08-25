// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
    FormControl,
    FormLabel,
    Switch,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import { FaUsers } from 'react-icons/fa';

import { useStakingPool } from '../../../services/pool';
import useStakingPoolQuery from '../../../graphql/hooks/useStakingPool';
import Layout, {
    PageBody,
    PageHeader,
    PagePanel,
} from '../../../components/Layout';
import AddressText from '../../../components/AddressText';
import TransactionFeedback from '../../../components/TransactionFeedback';
import NameForm from '../../../components/pools/NameForm';
import FlatRateContainer from '../../../containers/pool/FlatRateContainer';
import GasTaxContainer from '../../../containers/pool/GasTaxContainer';
import Rebalance from '../../../components/pools/Rebalance';
import { useNode } from '../../../services/node';
import { useUserNode } from '../../../graphql/hooks/useNodes';
import Node from '../../../components/node/Node';
import { useBalance } from '../../../services/eth';
import { useWallet } from '../../../contexts/wallet';

const ManagePool = () => {
    const router = useRouter();
    const address = router.query.pool as string;
    const { account, chainId } = useWallet();

    const userBalance = useBalance(account);
    const pool = useStakingPool(address, account);
    const stakingPool = useStakingPoolQuery(address);

    // get most recent node hired by user (if any)
    const existingNode = useUserNode(address);

    // use a state variable for the typed node address
    const [worker, setWorker] = useState<string>();

    // priority is the typed address (at state variable)
    const activeWorker = worker || existingNode || '';

    const node = useNode(activeWorker);

    // infer fee type from graphql data (not contract)
    const feeType =
        stakingPool?.fee?.commission != null
            ? 'flatRate'
            : stakingPool?.fee?.gas != null
            ? 'gasTax'
            : undefined;

    // dark mode compatible background color
    const bg = useColorModeValue('white', 'gray.700');

    return (
        <Layout>
            <Head>
                <title>Explorer - Edit Pool</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PageHeader>
                <AddressText
                    address={stakingPool?.id}
                    chainId={chainId}
                    icon={FaUsers}
                >
                    <Text>Staking Pool</Text>
                </AddressText>
            </PageHeader>
            <PagePanel>
                <Node
                    bg={bg}
                    p={[5, 5, 10, 10]}
                    chainId={chainId}
                    account={pool.address}
                    address={activeWorker}
                    balance={node.balance}
                    user={node.user}
                    userBalance={userBalance}
                    available={node.available}
                    pending={node.pending}
                    owned={node.owned}
                    retired={node.retired}
                    authorized={node.authorized}
                    onAddressChange={setWorker}
                    onHire={pool.hire}
                    onCancelHire={pool.cancelHire}
                    onRetire={pool.retire}
                    onTransfer={(worker, amount) => node.transfer(amount)}
                    w="100%"
                />
            </PagePanel>
            <PageBody>
                <TransactionFeedback transaction={pool.transaction} />
                <TransactionFeedback transaction={node.transaction} />
                <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="pause" mb="0">
                        Pool accepting new stakes?
                    </FormLabel>
                    <Switch
                        id="pause"
                        size="lg"
                        isChecked={!pool.paused}
                        onChange={pool.paused ? pool.unpause : pool.pause}
                    />
                </FormControl>
                <NameForm onSetName={pool.setName} />
                {feeType == 'flatRate' && <FlatRateContainer pool={address} />}
                {feeType == 'gasTax' && <GasTaxContainer pool={address} />}
                <Rebalance
                    w="100%"
                    stake={pool.amounts?.stake}
                    unstake={pool.amounts?.unstake}
                    withdraw={pool.amounts?.withdraw}
                    onRebalance={pool.rebalance}
                />
            </PageBody>
        </Layout>
    );
};

export default ManagePool;
