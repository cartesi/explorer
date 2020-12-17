import _ from 'lodash';
import { useQuery } from '@apollo/client';
import { UserData, UserVars } from '../models';
import { USER } from '../queries/user';

const useUser = (id: string) => {
    const { data } = useQuery<UserData, UserVars>(USER, {
        variables: {
            id: id?.toLowerCase(),
        },
        notifyOnNetworkStatusChange: true,
        pollInterval: 60000,
    });

    return data?.user;
};

export default useUser;
