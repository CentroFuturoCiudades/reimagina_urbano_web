import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { useState } from "react";
import { POLYGON_MODES, VIEW_MODES } from "../constants";
import { DrawPolygonMode, ModifyMode } from "@nebula.gl/edit-modes";
import { setPoligonMode } from "../features/viewMode/viewModeSlice";

export const useDrawPoligonLayer = () => {
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);
    const poligonMode = useSelector(
        (state: RootState) => state.viewMode.poligonMode
    );

    const dispatch: AppDispatch = useDispatch();

    const [polygon, setPolygon] = useState<any>({
        type: "FeatureCollection",
        features: [],
    });

    const handleEdit = ({ updatedData, editType, editContext }: any) => {
        const selectedArea = updatedData.features[0];
        if (selectedArea) {
            setPolygon({
                type: "FeatureCollection",
                features: updatedData.features,
            });
        }
    };

    if (viewMode !== VIEW_MODES.POLIGON) {
        return { drawPoligonData: polygon, layers: [] };
    }

    var mode: DrawPolygonMode | ModifyMode;

    switch (poligonMode) {
        case POLYGON_MODES.EDIT:
            mode = new ModifyMode();
            break;

        case POLYGON_MODES.DELETE:
            setPolygon({
                type: "FeatureCollection",
                features: [],
            });
            dispatch(setPoligonMode(POLYGON_MODES.VIEW));

            break;
    }

    // const drawLayer = new EditableGeoJsonLayer({
    //     id: "editable-layer",
    //     data: polygon,
    //     mode:
    //         polygon.features.length === 0
    //             ? new DrawPolygonMode()
    //             : new DrawPolygonMode(),
    //     selectedFeatureIndexes: [0],
    //     onEdit: handleEdit,
    //     pickable: true,
    //     getTentativeFillColor: [255, 255, 255, 50],
    //     getFillColor: [0, 0, 0, 0],
    //     getTentativeLineColor: [0, 100, 0, 200],
    //     getTentativeLineWidth: 4,
    //     getLineColor: [0, 100, 0, 200],
    //     getLineWidth: 4,
    // });

    return { drawPoligonData: polygon, layers: [] };
};
