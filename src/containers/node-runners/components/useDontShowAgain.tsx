const useDontShowAgain = (key: string) => {
    const fromLocalStorage = localStorage.getItem(key);
    const value = fromLocalStorage ? JSON.parse(fromLocalStorage) : true;
    const handleDontShowAgain = () => localStorage.setItem(key, 'false');

    return {
        value,
        handleDontShowAgain,
    };
};

export default useDontShowAgain;
