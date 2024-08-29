import { load } from "@loaders.gl/core";
import { FlatGeobufLoader } from "@loaders.gl/flatgeobuf";
import { GenericObject } from '../types';
import { fetchPolygonData } from "../utils";
import { IconLayer } from "deck.gl";

interface AccessibilityPointsProps {
    coordinates: any[];
    layer: string;
}

const AccessibilityPoints = async ({ coordinates, layer }: AccessibilityPointsProps) => {
    if (!coordinates || coordinates.length === 0) {
        return null;
    }

    const accessibilityPointsData = await fetchPolygonData({ coordinates, layer });

    type AmenityType =
        "Laboratorios clínicos" |
        "Educación Preescolar" |
        "Educación Secundaria" |
        "Educación Primaria" |
        "Otros consultorios" |
        "Otros Servicios recreativos" |
        "Guarderia" |
        "Farmacia" |
        "Consultorios médicos" |
        "Parques recreativos" |
        "Educación Media Superior" |
        "Hospital general" |
        "Asistencia social" |
        "Cine" |
        "Museos";

    const getAmenityColor = (amenity: AmenityType) => {
        switch (amenity) {
            case "Laboratorios clínicos":
                return "darkred";
            case "Educación Preescolar":
                return "blue";
            case "Educación Secundaria":
                return "orange";
            case "Educación Primaria":
                return "teal";
            case "Otros consultorios":
                return "yellow";
            case "Otros Servicios recreativos":
                return "purple";
            case "Guarderia":
                return "green";
            case "Farmacia":
                return "red";
            case "Consultorios médicos":
                return "lightgreen";
            case "Parques recreativos":
                return "lightblue";
            case "Educación Media Superior":
                return "pink";
            case "Hospital general":
                return "crimson";
            case "Asistencia social":
                return "olive";
            case "Cine":
                return "gold";
            case "Museos":
                return "indigo";
            default:
                return "gray"; 
        }
    };

    const data = accessibilityPointsData.features.map((feature: any) => {
        const amenity = feature.properties.amenity as AmenityType;
        const color = getAmenityColor(amenity);

        return {
            position: feature.geometry.coordinates,
            icon: {
                url: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="50" fill="${color}"/></svg>`,
                width: 50,
                height: 50,
                anchorY: 50,
            },
            size: 10,
        };
    });

    return [
        new IconLayer({
            id: 'icon-layer',
            data,
            pickable: true,
            getIcon: (d: any) => d.icon,
            getPosition: (d: any) => d.position,
            getSize: (d: any) => d.size,
            getColor: [255, 255, 255], 
        })
    ];
};

export default AccessibilityPoints;
