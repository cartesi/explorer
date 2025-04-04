import {
    getENSStaticProps,
    getPoolsStaticPaths,
} from '../../../../utils/staticGeneration';
import { FC } from 'react';
import { notFound } from 'next/navigation';
import StakePoolStake from '../../../../components/stake/StakePoolStake';

export const revalidate = 86400;

export async function generateStaticParams() {
    return getPoolsStaticPaths();
}

interface StakePoolPageProps {
    params: Promise<{ pool: string }>;
}

export async function generateMetadata(props: StakePoolPageProps) {
    const params = await props.params;
    const data = await getENSStaticProps({ params });

    return {
        title: `Stake to ${data.formattedAddress}`,
        description: `Stake to ${data.formattedAddress}`,
    };
}

const StakePoolStakePage: FC<StakePoolPageProps> = async (props) => {
    const params = await props.params;
    const data = await getENSStaticProps({ params });

    if (data.notFound) {
        notFound();
    }

    return <StakePoolStake />;
};

export default StakePoolStakePage;
