import React, { useState, useCallback } from 'react';

const DataContext = React.createContext({
    currentTransaction: null,
    submitting: false,
    error: null,
    setContext: (state: any) => { }
});

const DataProvider = ({ children }) => {
    const [state, setState] = useState({
        currentTransaction: null,
        submitting: false,
        error: null
    });

    const setContext = useCallback(
        (newState) => {
            setState({ ...state, ...newState });
        }, [state, setState]
    );

    const getContextValue = useCallback(
        () => ({ ...state, setContext }),
        [state, setContext]
    );

    return (
        <DataContext.Provider value={getContextValue()}>
            {children}
        </DataContext.Provider>
    );
}

export { DataContext, DataProvider };