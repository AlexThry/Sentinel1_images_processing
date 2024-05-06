import React, {createContext, useContext, useState} from 'react';
import {MainDataContext} from "../MainDataProvider/MainDataProvider.jsx";

export const ProcessDataContext = createContext();

export const ProcessDataProvider = ({ children }) => {
    const {isProcessing, setIsProcessing} = useContext(MainDataContext)

    const [processPolygon, setProcessPolygon] = useState("");
    const [downloaded, setDownloaded] = useState({})
    const [previewPolygon, setPreviewPolygon] = useState("")


    return (
        <ProcessDataContext.Provider value={{ processPolygon, setProcessPolygon, downloaded, setDownloaded, previewPolygon, setPreviewPolygon, isProcessing, setIsProcessing }}>
            {children}
        </ProcessDataContext.Provider>
    );
};

