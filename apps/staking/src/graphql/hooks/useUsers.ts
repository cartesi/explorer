// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useQuery } from '@apollo/client';
import { USERS } from '../queries';
import { UsersData, UsersVars } from '../models';

const useUsers = (
    pageNumber: number,
    id: string = undefined,
    sort = 'timestamp',
    perPage = 10
) => {
    const filter = id ? { id: id.toLowerCase() } : {};
    const tenMinutesInMs = 600000;

    return useQuery<UsersData, UsersVars>(USERS, {
        variables: {
            first: perPage,
            where: filter,
            skip: pageNumber * perPage,
            orderBy: sort,
            orderDirection: 'desc',
        },
        notifyOnNetworkStatusChange: true,
        pollInterval: tenMinutesInMs,
    });
};

export default useUsers;
