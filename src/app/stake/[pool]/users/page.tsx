import {
    getENSStaticProps,
    getPoolsStaticPaths,
} from '../../../../utils/staticGeneration';
import { FC } from 'react';
import { notFound } from 'next/navigation';
import StakePoolUsers from '../../../../components/stake/StakePoolUsers';

export const revalidate = 60 * 60 * 24;

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
        title: `Pool users - ${data.formattedAddress}`,
        description: `Pool users - ${data.formattedAddress}`,
    };
}

const StakePoolUsersPage: FC<StakePoolPageProps> = async (props) => {
    const params = await props.params;
    const data = await getENSStaticProps({ params });

    if (data.notFound) {
        notFound();
    }

    return <StakePoolUsers />;
};

export default StakePoolUsersPage;
