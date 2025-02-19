// Copyright (C) 2024 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import type { Config } from 'drizzle-kit';
import { join } from 'path';

const base = join('.', 'src', 'db');

const config: Config = {
    schema: `${base}/schemas.ts`,
    out: `${base}/migrations`,
    dialect: 'turso',
    dbCredentials: {
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
    },
    casing: 'snake_case',
};

export default config;
