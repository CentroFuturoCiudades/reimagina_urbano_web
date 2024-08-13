import React, { useEffect } from "react";
import "./Toolbar.scss";
import { AppDispatch, RootState } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { setViewMode } from "../../features/viewMode/viewModeSlice";
import { center } from "@turf/turf";
import { Flex } from "@chakra-ui/react";
import { setViewState } from "../../features/viewState/viewStateSlice";
import { VIEW_MODES } from "../../constants";

const Toolbar = () => {

    const dispatch: AppDispatch = useDispatch();
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode );
    //const zoomLevel = useSelector( (state: RootState) => state.zoomLevel);
    const viewState = useSelector ( (state: RootState) => state.viewState)

   /* useEffect(() => {
        console.log('zzoom', viewState.zoom)
    },[viewState])*/

    const zoomIn = () => {
       // dispatch(setViewState(zoomLevel.zoom + 1))
       dispatch (setViewState({
        zoom: viewState.zoom + 1
       }));
    }

    const zoomOut = () => {
        //dispatch(setViewState(zoomLevel.zoom - 1))
        dispatch (setViewState({
            zoom: viewState.zoom - 1
        }));
    }



    return (
        <div className="toolbar">
            {/* 1st row title */}
            <div className="toolbar__title" style={{backgroundColor:"rgba(50, 50, 50, 0.8)", color:"white", textAlign:"center"}}>
                TOOLBAR
            </div>

            {/*2nd row*/}
            <div style={{
                display:"flex",
                //flexDirection:"row",
                border:"1px solid lightgrey",
            }}>
                {/* VISTA SECC.1 */}
                <div className="toolbar__section">
                    VISTA
                    {/* opciones dentro de VISTA */}
                    <div className="toolbar__vista">
                        <img
                            className={ viewMode == VIEW_MODES.FULL ? "toolbar__tools--active" : ""}
                            onClick={ ()=> dispatch(setViewMode( VIEW_MODES.FULL )) }
                            src="https://sinaloa.travel/images/destinos/culiacan/Culiacan-map.png"
                        />
                        <img
                            className={ viewMode == VIEW_MODES.POLIGON ? "toolbar__tools--active" : ""}
                            onClick={ ()=> dispatch(setViewMode( VIEW_MODES.POLIGON )) }
                            src="https://cdn-icons-png.flaticon.com/512/7168/7168063.png"
                        />
                        <img
                            className={ viewMode == VIEW_MODES.LENS ? "toolbar__tools--active" : ""}
                            onClick={ ()=> dispatch(setViewMode( VIEW_MODES.LENS)) }
                            src="https://icones.pro/wp-content/uploads/2021/06/icone-loupe-noir.png"
                        />
                    </div>
                </div>

                {/* DIM SECC.2 */}
                <div className="toolbar__section">
                    DIM
                    {/* opciones dentro de DIM */}
                    <div className="toolbar__dim">
                        <span>2D</span>
                        <span>3D</span>
                    </div>
                </div>

                {/* ZOOM SECC.3*/}
                <div className="toolbar__section">
                    ZOOM
                    {/* opciones dentro de ZOOM */}
                    <div className="toolbar__zoom">
                        <div className="toolbar__zoomitems">
                            <span
                            onClick={zoomIn}
                            > + </span>
                            <span
                            onClick={zoomOut}
                            > - </span>
                        </div>
                        <div className="toolbar__zoomitems">
                            <span> { viewState.zoom.toFixed(1) } </span>
                        </div>
                    </div>
                </div>

                {/* ESCALA SECC.4 */}
                <div className="toolbar__section">
                    ESCALA
                    {/* 3rd row dentro de vista */}
                    <div className="toolbar__vista">
                        <img src="https://sinaloa.travel/images/destinos/culiacan/Culiacan-map.png" style={{minWidth: "48px", maxWidth: "48px", border:"1px solid lightgrey"}}></img>
                    </div>
                </div>

            </div>




            {/*

            <div className="toolbar__tools">
                <span
                    className={ viewMode == "full" ? "toolbar__tools--active" : ""}
                    onClick={ ()=> dispatch(setViewMode("full")) }
                >
                        Completo
                </span>
                <span
                    className={ viewMode == "poligon" ? "toolbar__tools--active" : ""}
                    onClick={ ()=> dispatch(setViewMode("poligon")) }
                >
                        Poligono
                </span>
                <span
                    className={ viewMode == "lens" ? "toolbar__tools--active" : ""}
                    onClick={ ()=> dispatch(setViewMode("lens")) }
                >
                        Lupa
                </span>
            </div>
        */}
        </div>
    );
};

export default Toolbar;
