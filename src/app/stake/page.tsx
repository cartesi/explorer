import Stake from '../../components/stake/Stake';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Join a Cartesi staking pool',
    description: 'Join a Cartesi staking pool',
};

export default function StakePage() {
    return <Stake />;
}
