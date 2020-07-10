// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Info } from './components/Info';

export interface NodeProps {
    address: string;
}

export const Node = (props: NodeProps) => {
    return (
        <Container>
            <Row>
                <Col>
                    <Sidebar />
                </Col>
                <Col>
                    <Header address={props.address} />
                    <Routes>
                        <Route path="/" element={<Info {...props} />} />
                    </Routes>
                </Col>
            </Row>
        </Container>
    );
};
