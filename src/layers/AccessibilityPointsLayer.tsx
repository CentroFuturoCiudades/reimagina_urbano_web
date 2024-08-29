import React from 'react';
import { IconLayer } from 'deck.gl';
import { FaClinicMedical, FaSchool, FaPills, FaTree, FaHospital, FaHome, FaUniversity, FaFilm, FaLandmark } from 'react-icons/fa';
import { renderToStaticMarkup } from 'react-dom/server';
import { fetchPolygonData } from "../utils";

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

    const iconToBase64 = (icon: JSX.Element, color: string = 'black'): string => {
        const iconMarkup = renderToStaticMarkup(React.cloneElement(icon, { color }));
        return `data:image/svg+xml;base64,${btoa(iconMarkup)}`;
    };

    const getIcon = (amenity: AmenityType) => {
        switch (amenity) {
            case "Laboratorios clínicos":
                return iconToBase64(<FaClinicMedical />, "darkred");
            case "Educación Preescolar":
                return iconToBase64(<FaSchool />, "blue");
            case "Educación Secundaria":
                return iconToBase64(<FaSchool />, "orange");
            case "Educación Primaria":
                return iconToBase64(<FaHome />, "teal");
            case "Otros consultorios":
                return iconToBase64(<FaClinicMedical />, "yellow");
            case "Otros Servicios recreativos":
                return iconToBase64(<FaTree />, "purple");
            case "Guarderia":
                return iconToBase64(<FaSchool />, "green");
            case "Farmacia":
                return iconToBase64(<FaPills />, "red");
            case "Consultorios médicos":
                return iconToBase64(<FaClinicMedical />, "lightgreen");
            case "Parques recreativos":
                return iconToBase64(<FaTree />, "lightblue");
            case "Educación Media Superior":
                return iconToBase64(<FaUniversity />, "pink");
            case "Hospital general":
                return iconToBase64(<FaHospital />, "crimson");
            case "Asistencia social":
                return iconToBase64(<FaHome />, "olive");
            case "Cine":
                return iconToBase64(<FaFilm />, "gold");
            case "Museos":
                return iconToBase64(<FaLandmark />, "indigo");
            default:
                return iconToBase64(<FaClinicMedical />, "gray");
        }
    };

    const data = accessibilityPointsData.features.map((feature: any) => {
        const amenity = feature.properties.amenity as AmenityType;
        const icon = getIcon(amenity);

        return {
            position: feature.geometry.coordinates,
            icon: {
                url: icon,
                width: 50,
                height: 50,
                anchorY: 50,
            },
            size: 30,
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
