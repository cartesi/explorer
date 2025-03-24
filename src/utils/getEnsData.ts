'use server';

import AddressENSService from '../services/server/ens/AddressENSService';

export const getEnsData = async () => {
    const result = await AddressENSService.listAll();
    return result.ok ? result.data : [];
};
