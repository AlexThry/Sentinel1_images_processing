import React, { createContext, useState } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [downloadPolygon, setDownloadPolygon] = useState("");
    const [processPolygon, setProcessPolygon] = useState("");
    const [images, setImages] = useState()

    return (
        <DataContext.Provider value={{ downloadPolygon, setDownloadPolygon, images, setImages, processPolygon, setProcessPolygon }}>
            {children}
        </DataContext.Provider>
    );
};

