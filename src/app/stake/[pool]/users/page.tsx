import { FC } from 'react';
import { notFound } from 'next/navigation';
import StakePoolUsers from '../../../../components/stake/StakePoolUsers';
import { ethers } from 'ethers';
import { getFormattedEnsName } from '../../../../services/server/utils';
import { Metadata } from 'next';

interface StakePoolPageProps {
    params: Promise<{ pool: string }>;
}

export async function generateMetadata(
    props: StakePoolPageProps
): Promise<Metadata> {
    const params = await props.params;
    const address = params.pool;

    if (!ethers.utils.isAddress(address)) {
        notFound();
    }

    const formattedAddress = await getFormattedEnsName(address);

    return {
        title: `Pool users - ${formattedAddress}`,
        description: `Pool users - ${formattedAddress}`,
    };
}

const StakePoolUsersPage: FC<StakePoolPageProps> = async (props) => {
    const params = await props.params;

    if (!ethers.utils.isAddress(params.pool)) {
        notFound();
    }

    return <StakePoolUsers />;
};

export default StakePoolUsersPage;
