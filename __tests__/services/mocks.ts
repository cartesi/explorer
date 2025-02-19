// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { ContractTransaction, Event } from 'ethers';
import { mock } from 'jest-mock-extended';
import { buildContractReceipt } from '../components/node/mocks';

const contractTransactionFactory = () => mock<ContractTransaction>();
const receiptEventFactory = () => mock<Event>();

const buildContractTransaction = () => contractTransactionFactory();

const buildContractReceiptEvent = () => receiptEventFactory();

export {
    buildContractReceipt,
    buildContractTransaction,
    buildContractReceiptEvent,
};
