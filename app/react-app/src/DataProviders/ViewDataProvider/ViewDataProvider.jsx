import React, { createContext, useState } from 'react';

export const ViewDataContext = createContext();

export const ViewDataProvider = ({ children }) => {

    const [previewPolygon, setPreviewPolygon] = useState("")
    const [selectedFolder, setSelectedFolder] = useState()
    const [subsFolders, setSubsFolders] = useState([])


    return (
        <ViewDataContext.Provider value={{ previewPolygon, setPreviewPolygon, selectedFolder, setSelectedFolder, subsFolders, setSubsFolders }}>
            {children}
        </ViewDataContext.Provider>
    );
};

