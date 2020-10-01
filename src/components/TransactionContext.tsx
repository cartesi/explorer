import React, { useState, useCallback } from 'react';

const TransactionContext = React.createContext({
    currentTransaction: null,
    submitting: false,
    error: null,
    setContext: (state: any) => { }
});

const TransactionProvider = ({ children }) => {
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
        <TransactionContext.Provider value={getContextValue()}>
            {children}
        </TransactionContext.Provider>
    );
}

export { TransactionContext, TransactionProvider };