import React, { createContext, useState } from 'react';

export const DownloadDataContext = createContext();

export const DowloadDataProvider = ({ children }) => {
    const [downloadPolygon, setDownloadPolygon] = useState("");
    const [processPolygon, setProcessPolygon] = useState("");
    const [images, setImages] = useState()

    return (
        <DownloadDataContext.Provider value={{ downloadPolygon, setDownloadPolygon, images, setImages, processPolygon, setProcessPolygon }}>
            {children}
        </DownloadDataContext.Provider>
    );
};

