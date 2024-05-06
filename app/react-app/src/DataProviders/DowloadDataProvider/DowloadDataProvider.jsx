import React, {createContext, useContext, useState} from 'react';
import {MainDataContext} from "../MainDataProvider/MainDataProvider.jsx";

export const DownloadDataContext = createContext();

export const DowloadDataProvider = ({ children }) => {
    const {isDownloading, setIsDownloading} = useContext(MainDataContext)
    const [downloadPolygon, setDownloadPolygon] = useState("");
    const [processPolygon, setProcessPolygon] = useState("");
    const [images, setImages] = useState()

    return (
        <DownloadDataContext.Provider value={{ downloadPolygon, setDownloadPolygon, images, setImages, processPolygon, setProcessPolygon, isDownloading, setIsDownloading }}>
            {children}
        </DownloadDataContext.Provider>
    );
};

