import { FC } from 'react';
import { notFound } from 'next/navigation';
import StakePoolStake from '../../../../components/stake/StakePoolStake';
import { ethers } from 'ethers';
import { getFormattedEnsName } from '../../../../services/server/utils';

interface StakePoolPageProps {
    params: Promise<{ pool: string }>;
}

export async function generateMetadata(props: StakePoolPageProps) {
    const params = await props.params;
    const address = params.pool;

    if (!ethers.utils.isAddress(address)) {
        notFound();
    }

    const formattedAddress = getFormattedEnsName(address);

    return {
        title: `Stake to ${formattedAddress}`,
        description: `Stake to ${formattedAddress}`,
    };
}

const StakePoolStakePage: FC<StakePoolPageProps> = async (props) => {
    const params = await props.params;

    if (!ethers.utils.isAddress(params.pool)) {
        notFound();
    }

    return <StakePoolStake />;
};

export default StakePoolStakePage;
