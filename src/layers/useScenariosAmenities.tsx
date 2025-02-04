import {
    DrawPointMode,
    EditableGeoJsonLayer,
    ModifyMode,
} from "@deck.gl-community/editable-layers";
import { useState } from "react";
import {
    addScenarioAmenity,
    setCurrentScenarioAmenity,
} from "../features/scenarios/scenariosSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";

const useScenariosAmenities = () => {
    const scenariosAmenities = useSelector(
        (state: RootState) => state.scenarios.scenariosAmenities
    );
    const currentScenarioAmenity = useSelector(
        (state: RootState) => state.scenarios.currentScenarioAmenity
    );
    const isScenarioEdit = useSelector(
        (state: RootState) => state.scenarios.isScenarioEdit
    );
    const dispatch = useDispatch();

    const handleEdit = (props: any) => {
        const { updatedData, editType, editContext } = props;
        console.log(editType);

        if (editType === "addFeature") {
            const newFeature =
                updatedData.features[editContext.featureIndexes[0]];
            const id = new Date().getTime();
            dispatch(
                addScenarioAmenity({
                    ...newFeature,
                    properties: { id, ...newFeature.properties },
                })
            );
            dispatch(setCurrentScenarioAmenity(id));
        } else if (editType === "updateFeature" || editType === "drag") {
            const updatedFeature =
                updatedData.features[editContext.featureIndexes[0]];
            dispatch(setCurrentScenarioAmenity(updatedFeature.id));
        }
    };
    const handleLayerClick = (info: any) => {
        if (info.object) {
            dispatch(setCurrentScenarioAmenity(info.object.properties.id));
        }
    };

    console.log(scenariosAmenities);
    // @ts-ignore
    const editableLayer = new EditableGeoJsonLayer({
        id: "editable-geojson-layer",
        data: scenariosAmenities,
        mode: isScenarioEdit ? ModifyMode : DrawPointMode,
        onEdit: handleEdit,
        getFillColor: [0, 0, 255, 128],
        getRadius: 50,
        pointRadiusMinPixels: 5,
        pointRadiusMaxPixels: 15,
        pickable: true,
        selectedFeatureIndexes: scenariosAmenities.features.findIndex(
            (feature: any) => feature.properties.id === currentScenarioAmenity
        ),
        onClick: handleLayerClick,
    });

    return [editableLayer];
};

export default useScenariosAmenities;
