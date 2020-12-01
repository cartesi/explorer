import React, { useEffect, useState } from 'react';

import _ from 'lodash';
import { useQuery } from '@apollo/client';
import { User, UserData, UserVars } from '../models';
import { USER } from '../queries/user';

const useUser = (id: string) => {
    const [user, setUser] = useState<User>();

    const { loading, error, data } = useQuery<UserData, UserVars>(USER, {
        variables: {
            id,
        },
        notifyOnNetworkStatusChange: true,
    });

    useEffect(() => {
        if (!loading && !error && data) {
            setUser(data.user);
        }
    }, [loading, error, data]);

    return {
        user,
    };
};

export default useUser;
