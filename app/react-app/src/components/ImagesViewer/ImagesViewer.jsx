import {useContext, useState} from "react";
import {ViewDataContext} from "../../DataProviders/ViewDataProvider/ViewDataProvider.jsx";

function ImagesViewer({folderName, imageType, geometry}) {

    const {subsFolders, selectedFolder} = useContext(ViewDataContext)

    const [images, setImages] = useState([])

    const baseUrl = "http://localhost:8080/"
    return (
        <>
            <div className={"h-full w-full"}>
                <div className="carousel w-full h-full">

                    {
                        subsFolders.map((folder, index) => {
                            return (

                                <div key={index} id={index} className="carousel-item relative w-full h-full">
                                    <img className={"w-full h-full object-contain"}
                                         src={`${baseUrl}interferometric_image/${selectedFolder}/${folder}/${folder}_${imageType}.png`} alt=""/>
                                    <span
                                        className={"absolute bg-black text-white px-2 rounded-lg top-5 left-5 text-lg"}>{folder}</span>
                                    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                                        <a href={`#${(index - 1 + subsFolders.length) % subsFolders.length}`}
                                           className="btn text-white mix-blend-difference btn-circle bg-opacity-50">&lt;</a>
                                        <a href={`#${(index + 1) % subsFolders.length}`} className="btn text-white mix-blend-difference btn-circle bg-opacity-50">&gt;</a>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default ImagesViewer;

async function fetchImages(folderName, folderSize, setImages) {

}