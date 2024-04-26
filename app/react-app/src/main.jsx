import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import RootLayout from "./routes/RootLayout/RootLayout.jsx";
import FrontPage from "./routes/FrontPage/FrontPage.jsx";
import DownloadPage from "./routes/DownloadPage/DownloadPage.jsx";
import ProcessPage from "./routes/ProcessPage/ProcessPage.jsx";
import {DowloadDataProvider} from "./components/DowloadDataProvider/DowloadDataProvider.jsx";
import ViewPage from "./routes/ViewPage/ViewPage.jsx";
import DownloadDetails from "./components/DownloadDetails/DownloadDetails.jsx";
import ProcessDetails from "./components/ProcessDetails/ProcessDetails.jsx";
import {ProcessDataProvider} from "./components/ProcessDataProvider/ProcessDataProvider.jsx";


const router = createBrowserRouter([
    {path: '/', element: <RootLayout/>, children: [
            {path: "/", element: <FrontPage/>},
            {
                path: "/download",
                element: <DowloadDataProvider children={<DownloadPage/>}/>,
                children: [
                    {path: "/download/:id", element: <DownloadDetails/>}
                ],
            },
            {
                path: "/process",
                element: <ProcessDataProvider children={<ProcessPage/>}/>,
                children: [
                    {path: "/process/:id", element: <ProcessDetails/>}
                ]
            },
            {path: "/view", element: <ViewPage/>}
        ]}
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>,
)
