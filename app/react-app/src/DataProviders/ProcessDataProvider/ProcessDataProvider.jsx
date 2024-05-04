import React, { createContext, useState } from 'react';

export const ProcessDataContext = createContext();

export const ProcessDataProvider = ({ children }) => {
    const [processPolygon, setProcessPolygon] = useState("");
    const [downloaded, setDownloaded] = useState({})
    const [previewPolygon, setPreviewPolygon] = useState("")

    return (
        <ProcessDataContext.Provider value={{ processPolygon, setProcessPolygon, downloaded, setDownloaded, previewPolygon, setPreviewPolygon }}>
            {children}
        </ProcessDataContext.Provider>
    );
};

