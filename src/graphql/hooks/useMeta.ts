import _ from 'lodash';
import { useQuery } from '@apollo/client';
import { _Meta_, MetaData } from '../models';
import { META } from '../queries/meta';

const useMeta = () => {
    const { data } = useQuery<MetaData>(META, {
        variables: {},
        notifyOnNetworkStatusChange: true,
        pollInterval: 30000,
    });

    return data?._meta;
};

export default useMeta;
