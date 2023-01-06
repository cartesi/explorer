// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import { useEffect, useState } from 'react';
import { useNetwork } from './useNetwork';
import { useRollupsFactory } from './useRollupsFactory';

export interface Applications {
    loading: boolean;
    applications: string[];
}

export const useApplications = (): Applications => {
    const [applications, setApplications] = useState<Applications>({
        loading: false,
        applications: [],
    });
    const network = useNetwork();
    const factory = useRollupsFactory();

    useEffect(() => {
        if (factory && network) {
            // query the factory for all applications
            const deployment = network.deployment('CartesiDAppFactory');
            const deployBlock = deployment?.receipt?.blockNumber;

            // set loading
            setApplications({ loading: true, applications: [] });

            // query blockchain for all applications
            factory
                .queryFilter(factory.filters.ApplicationCreated(), deployBlock)
                .then((events) => {
                    const applications = {
                        loading: false,
                        applications: events.map((e) => e.args.application),
                    };
                    setApplications(applications);
                })
                .catch(() => {
                    setApplications({ loading: false, applications: [] });
                });
        } else {
            setApplications({ loading: false, applications: [] });
        }
    }, [factory, network]);

    return applications;
};
