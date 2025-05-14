import { FC } from 'react';
import { notFound } from 'next/navigation';
import StakePoolCommissions from '../../../../components/stake/StakePoolCommissions';
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
        title: `Pool commissions - ${formattedAddress}`,
        description: `Pool commissions - ${formattedAddress}`,
    };
}

const StakePoolCommissionsPage: FC<StakePoolPageProps> = async (props) => {
    const params = await props.params;

    if (!ethers.utils.isAddress(params.pool)) {
        notFound();
    }

    return <StakePoolCommissions />;
};

export default StakePoolCommissionsPage;
