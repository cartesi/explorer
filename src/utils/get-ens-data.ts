'use server';

import { handler } from '../app/api/[chain]/ens/route';

export const getEnsData = async () => {
    const res = await handler();
    const jsonRes = await res.json();

    return jsonRes.status === 200 ? jsonRes.data : [];
};
