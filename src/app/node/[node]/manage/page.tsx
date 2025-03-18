import ManageNode from '../../../../components/node/ManageNode';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Manage a Cartesi node',
    description: 'Manage a Cartesi node',
};

export default function ManageNodePage() {
    return <ManageNode />;
}
