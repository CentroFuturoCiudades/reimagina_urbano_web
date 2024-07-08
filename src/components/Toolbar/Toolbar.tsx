import React from "react";
import "./Toolbar.scss";
import { AppDispatch, RootState } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { setViewMode } from "../../features/viewMode/viewModeSlice";

const Toolbar = () => {

    const dispatch: AppDispatch = useDispatch();
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode );

    return (
        <div className="toolbar">
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
        </div>
    );
};

export default Toolbar;
