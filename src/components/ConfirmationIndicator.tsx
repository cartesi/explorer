// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useEffect, useState } from 'react';

enum ShowStoppers {
    SHOW,
    FADING_OUT,
    HIDE,
}

interface ConfirmationIndicatorProps {
    loading: boolean;
    error?: string;
}

const ConfirmationIndicator = (props: ConfirmationIndicatorProps) => {
    const [showMe, setShowMe] = useState<ShowStoppers>(ShowStoppers.HIDE);

    const [error, setError] = useState<string>();

    const hideMe = () => {
        setShowMe(ShowStoppers.FADING_OUT);

        setTimeout(() => {
            setShowMe(ShowStoppers.HIDE);
        }, 2000);
    };

    useEffect(() => {
        if (props.loading) {
            setShowMe(ShowStoppers.SHOW);
        } else {
            setShowMe(ShowStoppers.HIDE);
        }
    }, [props.loading]);

    useEffect(() => {
        setError(props.error);
    }, [props.error]);

    useEffect(() => {
        if (error) hideMe();
    }, [error]);

    return (
        <>
            <span
                className="confirmation-indicator"
                style={
                    showMe === ShowStoppers.SHOW
                        ? { opacity: 1 }
                        : showMe === ShowStoppers.FADING_OUT
                        ? {
                              opacity: 0,
                              transition: `opacity 2s ease-in`,
                          }
                        : { display: 'none' }
                }
            >
                <span className="confirmation-indicator-text">
                    {showMe === ShowStoppers.SHOW
                        ? 'Pending'
                        : showMe === ShowStoppers.FADING_OUT && error
                        ? 'Failure'
                        : 'Success'}
                </span>

                {showMe === ShowStoppers.SHOW ? (
                    <i className="fas fa-circle-notch fa-spin"></i>
                ) : showMe === ShowStoppers.FADING_OUT && error ? (
                    <i className="fas fa-times"></i>
                ) : (
                    <i className="fas fa-check"></i>
                )}
            </span>
        </>
    );
};

export default ConfirmationIndicator;
