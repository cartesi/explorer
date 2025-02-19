// Copyright (C) 2024 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { NextApiRequest } from 'next';

type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';

type AllowedMethodsParams = {
    methods: Methods[];
};

type Builder = (
    param: AllowedMethodsParams
) => (req: NextApiRequest) => boolean;

export const allowedMethodBuilder: Builder = ({ methods }) => {
    return (req: NextApiRequest) => {
        return methods.includes(req.method as Methods);
    };
};
