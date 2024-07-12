import React from "react";
import "./Toolbar.scss";
import { AppDispatch, RootState } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { setViewMode } from "../../features/viewMode/viewModeSlice";
import { center } from "@turf/turf";
import { Flex } from "@chakra-ui/react";

const Toolbar = () => {

    const dispatch: AppDispatch = useDispatch();
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode );

    return (
        <div className="toolbar">
            {/* 1st row title */}
            <div style={{backgroundColor:"rgba(50, 50, 50, 0.8)", color:"white", textAlign:"center"}}> TOOLBAR </div>

            {/*2nd row*/}
            <div style={{
                display:"flex", 
                flexDirection:"row", 
                width:"100%", //creo q se lo puedo quitar
                border:"1px solid lightgrey", 
            }}>
                {/* VISTA SECC.1 */}
                <div className="toolbar__title">
                    VISTA
                    {/* opciones dentro de VISTA */}
                    <div className="toolbar__vista">
                        <img 
                            className={ viewMode == "full" ? "toolbar__tools--active" : ""}
                            onClick={ ()=> dispatch(setViewMode("full")) } 
                            src="https://sinaloa.travel/images/destinos/culiacan/Culiacan-map.png"
                        />
                        <img 
                            className={ viewMode == "poligon" ? "toolbar__tools--active" : ""}
                            onClick={ ()=> dispatch(setViewMode("poligon")) }
                            src="https://cdn-icons-png.flaticon.com/512/7168/7168063.png"
                        />
                        <img
                            className={ viewMode == "lens" ? "toolbar__tools--active" : ""}
                            onClick={ ()=> dispatch(setViewMode("lens")) }
                            src="https://icones.pro/wp-content/uploads/2021/06/icone-loupe-noir.png"
                        />
                    </div>
                </div>
                
                {/* DIM SECC.2 */}
                <div className="toolbar__title">
                    DIM
                    {/* opciones dentro de DIM */}
                    <div className="toolbar__dim">
                        <span>2D</span>
                        <span>3D</span>
                    </div>
                </div>

                {/* ZOOM SECC.3*/}
                <div className="toolbar__title">
                    ZOOM
                    {/* opciones dentro de ZOOM */}
                    <div className="toolbar__zoom">
                        <div className="toolbar__colzoom">
                            <span> + </span>
                            <span> - </span>
                        </div>
                        <div className="toolbar__colzoom">
                            <span> 15 </span>
                        </div>
                    </div>
                </div>

                {/* ESCALA SECC.4 */}
                <div className="toolbar__title">
                    ESCALA
                    {/* 3rd row dentro de vista */}
                    <div className="toolbar__vista">
                        <img src="https://sinaloa.travel/images/destinos/culiacan/Culiacan-map.png" style={{minWidth: "50px", maxWidth: "100px", border:"1px solid lightgrey"}}></img>
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
