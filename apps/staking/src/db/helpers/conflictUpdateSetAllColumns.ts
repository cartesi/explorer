import { getTableColumns, sql } from 'drizzle-orm';
import { SQLiteTable, SQLiteUpdateSetSource } from 'drizzle-orm/sqlite-core';
import { snakeCase } from 'lodash/fp';

export function conflictUpdateSetAllColumns<TTable extends SQLiteTable>(
    table: TTable
): SQLiteUpdateSetSource<TTable> {
    const columns = getTableColumns(table);
    const conflictUpdateSet = Object.entries(columns).reduce(
        (acc, [columnName, columnInfo]) => {
            if (!columnInfo.default) {
                const dbColumnName = snakeCase(columnInfo.name);
                acc[columnName] = sql.raw(`excluded.${dbColumnName}`);
            }
            return acc;
        },
        {}
    ) as SQLiteUpdateSetSource<TTable>;

    return conflictUpdateSet;
}
