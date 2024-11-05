import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { useState } from "react";
import { POLYGON_MODES, VIEW_MODES } from "../constants";
import { EditableGeoJsonLayer } from "@nebula.gl/layers";
import { setPoligonMode } from "../features/viewMode/viewModeSlice";

export const useDrawPoligonLayer = () => {
    const dispatch: AppDispatch = useDispatch();
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);
    const poligonMode = useSelector(
        (state: RootState) => state.viewMode.poligonMode
    );

    const [polygon, setPolygon] = useState({
        type: "FeatureCollection",
        features: [],
    });

    const handleEdit = ({ updatedData }: { updatedData: any }) => {
        setPolygon(updatedData);
    };

    let mode = "drawPolygon";
    if (poligonMode === POLYGON_MODES.EDIT) {
        mode = "modify";
    } else if (poligonMode === POLYGON_MODES.DELETE) {
        setPolygon({
            type: "FeatureCollection",
            features: [],
        });
        dispatch(setPoligonMode(POLYGON_MODES.VIEW));
    }

    // Only render the layer if we're in polygon view mode
    if (viewMode !== VIEW_MODES.POLIGON) {
        return { drawPoligonData: polygon, layers: [] };
    }

    // Create the EditableGeoJsonLayer instance
    // const drawLayer = new EditableGeoJsonLayer({
    //     id: "editable-layer",
    //     data: polygon,
    //     mode: mode,
    //     onEdit: handleEdit,
    //     pickable: true,
    //     selectedFeatureIndexes: [0],
    //     getTentativeFillColor: [255, 255, 255, 50],
    //     getFillColor: [0, 0, 0, 0],
    //     getTentativeLineColor: [0, 100, 0, 200],
    //     getTentativeLineWidth: 4,
    //     getLineColor: [0, 100, 0, 200],
    //     getLineWidth: 4,
    // });

    return { drawPoligonData: polygon, layers: [] };
};
