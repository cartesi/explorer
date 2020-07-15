// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { Node } from './Node';
import './App.css';

function App() {
    return (
        <div className="App">
            <Node address="0x2218B3b41581E3B3fea3d1CB5e37d9C66fa5d3A0" />
        </div>
    );
}

export default App;
