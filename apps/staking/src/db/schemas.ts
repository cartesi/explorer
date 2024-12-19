import { sql } from 'drizzle-orm';
import { integer, sqliteTable as table, text } from 'drizzle-orm/sqlite-core';

export const addressEnsTable = table(
    'address_ens',
    {
        id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
        address: text().notNull().unique(),
        hasEns: integer({ mode: 'boolean' }).notNull(),
        updatedAt: integer({ mode: 'number' })
            .default(sql`(unixepoch())`)
            .$onUpdateFn(() => sql`(unixepoch())`),
        avatarUrl: text(),
        name: text(),
    },
    () => []
);

export type SelectAddressENS = typeof addressEnsTable.$inferSelect;
export type InsertAddressENS = Pick<SelectAddressENS, 'address' | 'hasEns'> &
    Partial<Pick<SelectAddressENS, 'avatarUrl' | 'name'>>;
export type UpdateAddressENS = Pick<
    SelectAddressENS,
    'id' | 'address' | 'hasEns'
> &
    Partial<Pick<SelectAddressENS, 'avatarUrl' | 'name'>>;
