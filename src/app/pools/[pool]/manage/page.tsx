import ManagePool from '../../../../components/pools/ManagePool';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Manage a Cartesi pool',
    description: 'Manage a Cartesi pool',
};

export default function ManagePoolPage() {
    return <ManagePool />;
}
