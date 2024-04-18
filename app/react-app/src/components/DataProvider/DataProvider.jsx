import React, { createContext, useState } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [data, setData] = useState("");
    const [images, setImages] = useState()

    return (
        <DataContext.Provider value={{ data, setData, images, setImages }}>
            {children}
        </DataContext.Provider>
    );
};

