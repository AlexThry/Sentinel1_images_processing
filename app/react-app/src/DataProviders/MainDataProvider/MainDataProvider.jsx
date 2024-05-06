import React, { createContext, useState } from 'react';

export const MainDataContext = createContext();

export const MainDataProvider = ({ children }) => {

    const [isDownloading, setIsDownloading] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)

    return (
        <MainDataContext.Provider value={{isDownloading, setIsDownloading, isProcessing, setIsProcessing}}>
            {children}
        </MainDataContext.Provider>
    );
};