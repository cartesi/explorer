import { FC } from 'react';
import StakePool from '../../../components/stake/StakePool';
import { notFound } from 'next/navigation';
import { ethers } from 'ethers';
import { getFormattedEnsName } from '../../../services/server/utils';
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
        title: `Cartesi pool info - ${formattedAddress}`,
        description: `Cartesi pool info - ${formattedAddress}`,
    };
}

const StakePoolPage: FC<StakePoolPageProps> = async (props) => {
    const params = await props.params;

    if (!ethers.utils.isAddress(params.pool)) {
        notFound();
    }

    return <StakePool />;
};

export default StakePoolPage;
