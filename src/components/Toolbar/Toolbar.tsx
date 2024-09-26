import React from "react";
import "./Toolbar.scss";
import { AppDispatch, RootState } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { setPoligonMode, setViewMode } from "../../features/viewMode/viewModeSlice";
import { setViewState } from "../../features/viewState/viewStateSlice";
import { POLYGON_MODES, VIEW_MODES } from "../../constants";

const Toolbar = () => {
    const dispatch: AppDispatch = useDispatch();
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);
    const viewState = useSelector((state: RootState) => state.viewState);

    const zoomIn = () => {
        // dispatch(setViewState(zoomLevel.zoom + 1))
        dispatch(
            setViewState({
                zoom: viewState.zoom + 1,
            })
        );
    };

    const zoomOut = () => {
        //dispatch(setViewState(zoomLevel.zoom - 1))
        dispatch(
            setViewState({
                zoom: viewState.zoom - 1,
            })
        );
    };

    return (
        <div className="toolbar">
            {/* 1st row title */}
            <div>
            <div
                className="toolbar__title"
            >
                TOOLBAR
            </div>

            {/*2nd row*/}
            <div
                style={{
                    display: "flex",
                    //flexDirection:"row",
                    border: "1px solid lightgrey",
                }}
            >
                {/* VISTA SECC.1 */}
                <div className="toolbar__section">
                    VISTA
                    {/* opciones dentro de VISTA */}
                    <div className="toolbar__vista">
                        <img
                            className={
                                viewMode == VIEW_MODES.FULL
                                    ? "toolbar__tools--active"
                                    : ""
                            }
                            onClick={() =>
                                dispatch(setViewMode(VIEW_MODES.FULL))
                            }
                            src="https://sinaloa.travel/images/destinos/culiacan/Culiacan-map.png"
                        />
                        <img
                            className={
                                viewMode == VIEW_MODES.POLIGON
                                    ? "toolbar__tools--active"
                                    : ""
                            }
                            onClick={() =>
                                dispatch(setViewMode(VIEW_MODES.POLIGON))
                            }
                            src="https://cdn-icons-png.flaticon.com/512/7168/7168063.png"
                        />
                        <img
                            className={
                                viewMode == VIEW_MODES.LENS
                                    ? "toolbar__tools--active"
                                    : ""
                            }
                            onClick={() =>
                                dispatch(setViewMode(VIEW_MODES.LENS))
                            }
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
                            <span onClick={zoomIn}> + </span>
                            <span onClick={zoomOut}> - </span>
                        </div>
                        <div className="toolbar__zoomitems">
                            <span> {viewState.zoom.toFixed(1)} </span>
                        </div>
                    </div>
                </div>

                {/* ESCALA SECC.4 */}
                <div className="toolbar__section">
                    ESCALA
                    {/* 3rd row dentro de vista */}
                    <div className="toolbar__vista">
                        <img
                            src="https://sinaloa.travel/images/destinos/culiacan/Culiacan-map.png"
                            style={{
                                minWidth: "48px",
                                maxWidth: "48px",
                                border: "1px solid lightgrey",
                            }}
                        ></img>
                    </div>
                </div>
            </div>
            </div>
            {
                viewMode == VIEW_MODES.POLIGON &&
                <div>
                    <div className="toolbar__title">ACCIONES: { VIEW_MODES[viewMode] } </div>
                    {
                        viewMode == VIEW_MODES.POLIGON  &&
                        <div className="toolbar__section">
                            <div className="toolbar__vista">
                                <div onClick={ ()=> { dispatch(  setPoligonMode( POLYGON_MODES.EDIT ) ) }}>
                                    Editar
                                    <img src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png"></img>
                                </div>
                                <div
                                    onClick={ ()=>{  dispatch(  setPoligonMode( POLYGON_MODES.DELETE ) ) }}
                                 >
                                    Borrar
                                    <img src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png "></img>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            }
        </div>
    );
};

export default Toolbar;
