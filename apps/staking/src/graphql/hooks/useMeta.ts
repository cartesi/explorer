// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useQuery } from '@apollo/client';
import { MetaData } from '../models';
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
