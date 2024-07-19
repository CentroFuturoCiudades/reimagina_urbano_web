import React from "react";
import "./Toolbar.scss";
import { AppDispatch, RootState } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { setViewMode } from "../../features/viewMode/viewModeSlice";
import { VIEW_MODES } from "../../constants";

const Toolbar = () => {

    const dispatch: AppDispatch = useDispatch();
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode );

    return (
        <div className="toolbar">
            <div className="toolbar__tools">
                <span
                    className={ viewMode === VIEW_MODES.FULL ? "toolbar__tools--active" : ""}
                    onClick={ ()=> dispatch(setViewMode( VIEW_MODES.FULL )) }
                >
                        Completo
                </span>
                <span
                    className={ viewMode === VIEW_MODES.POLIGON ? "toolbar__tools--active" : ""}
                    onClick={ ()=> dispatch(setViewMode( VIEW_MODES.POLIGON )) }
                >
                        Poligono
                </span>
                <span
                    className={ viewMode === VIEW_MODES.LENS ? "toolbar__tools--active" : ""}
                    onClick={ ()=> dispatch( setViewMode( VIEW_MODES.LENS )) }
                >
                        Lupa
                </span>
            </div>
        </div>
    );
};

export default Toolbar;
