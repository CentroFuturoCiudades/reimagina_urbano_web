import { GenericObject } from "./types";
import { generateGradientColors } from "./utils";
import * as d3 from "d3";

export const API_URL = "http://127.0.0.1:8000";
export const startColor = "#bdddff";
export const endColor = "#1A57FF";
export const AMOUNT = 8;
export const COLORS = generateGradientColors(startColor, endColor, AMOUNT);

export const INITIAL_STATE = {
    latitude: 24.748492613357698,
    longitude: -107.39527779958091,
    zoom: 15,
    transitionDuration: 100,
    pitch: 60,
    maxPitch: 85,
    bearing: 0,
    minZoom: 12,
    maxZoom: 22,
};

export const getQuantiles = (data: any, metric: string): [any, string[]] => {
    if (!data) return [null, []];
    const domain = METRICS_MAPPING[metric]?.ranges || [
        Math.min(
            ...(Object.values(data) as any).filter(
                (x: number) => x > 0
            )
        ),
        Math.max(...(Object.values(data) as any)),
    ];
    const colors = d3.quantize(
        d3.interpolateRgb(
            VIEW_COLORS_RGBA.ACCESIBILIDAD.light,
            VIEW_COLORS_RGBA.ACCESIBILIDAD.dark
        ),
        METRICS_MAPPING[metric]?.ranges ? domain.length - 1 : 5
    );
    const quantiles = METRICS_MAPPING[metric]?.ranges ?
        d3.scaleThreshold<number, string>().domain(domain).range([VIEW_COLORS_RGBA.ACCESIBILIDAD.light, ...colors]) :
        d3.scaleQuantize<string>().domain(domain).range(colors);
    return [quantiles, colors];
};

export const BLOB_URL = "https://reimaginaurbanostorage.blob.core.windows.net";

export const METRICS_MAPPING: GenericObject = {
    "poblacion": { query: "POBTOT", title: "Población Total", ranges: [0, 100, 200, 300, 400, 800], type: "number" },
    "viviendas_habitadas": { query: "VIVPAR_HAB", title: "Viviendas Particulares Habitadas", ranges: [0, 25, 50, 100, 150, 200], type: "number" },
    "grado_escuela": { query: "GRAPROES", title: "Grado Promedio de Escolaridad", ranges: [1, 6, 9, 12, 16, 18], type: "number" },
    "indice_bienestar": { query: "wellness_index", title: "Índice de Bienestar", ranges: [0, 25, 50, 75, 100], type: "percentage" },
    "viviendas_tinaco": { query: "VPH_TINACO * 1.0 / VIVPAR_HAB * 100", title: "Porcentaje de Viviendas con Tinaco", ranges: [0, 25, 50, 75, 100], type: "percentage" },
    "viviendas_pc": { query: "VPH_PC * 1.0 / VIVPAR_HAB * 100", title: "Porcentaje de Viviendas con PC", ranges: [0, 25, 50, 75, 100], type: "percentage" },
    "viviendas_auto":{ query: "VPH_AUTOM * 1.0 / VIVPAR_HAB * 100", title: "Porcentaje de Viviendas con Vehiculo Privado", ranges: [0, 50, 70, 90, 100], type: "percentage" },
    "minutes": { query: "minutes", title: "Minutos", ranges: [0, 5, 15, 30, 45, 60], type: "minutes" },
}
export const amenitiesOptions = [
    { value: 'asistencial_social', label: 'Asistencia social', type: 'health' },
    { value: 'laboratorios_clinicos', label: 'Laboratorios clínicos', type: 'health' },
    { value: 'otros_consultorios', label: 'Otros consultorios', type: 'health' },
    { value: 'consultorios_medicos', label: 'Consultorios médicos', type: 'health' },
    { value: 'hospital_general', label: 'Hospital general', type: 'health' },
    { value: 'hospitales_psiquiatricos', label: 'Hospitales psiquiátricos', type: 'health' },
    { value: 'hospitales_otras_especialidades', label: 'Hospitales otras especialidades', type: 'health' },
    { value: 'farmacia', label: 'Farmacia', type: 'health' },
    { value: 'clubs_deportivos_y_acondicionamiento_fisico', label: 'Clubs deportivos y de acondicionamiento físico', type: 'health' },
    { value: 'cine', label: 'Cine', type: 'recreation' },
    { value: 'otros_servicios_recreativos', label: 'Otros Servicios recreativos', type: 'recreation' },
    { value: 'parques_recreativos', label: 'Parques recreativos', type: 'park' },
    { value: 'museos', label: 'Museos', type: 'recreation' },
    { value: 'biblioteca', label: 'Biblioteca', type: 'recreation' },
    { value: 'guarderia', label: 'Guarderia', type: 'education' },
    { value: 'educacion_preescolar', label: 'Educación Preescolar', type: 'education' },
    { value: 'educacion_primaria', label: 'Educación Primaria', type: 'education' },
    { value: 'educacion_secundaria', label: 'Educación Secundaria', type: 'education' },
    { value: 'educacion_media_superior', label: 'Educación Media Superior', type: 'education' },
];
export const mappingGradoEscolaridad: GenericObject = {
    1: "1ero Primaria",
    2: "2do Primaria",
    3: "3ero Primaria",
    4: "4to Primaria",
    5: "5to Primaria",
    6: "6to Primaria",
    7: "1ero Secundaria",
    8: "2do Secundaria",
    9: "3ero Secundaria",
    10: "1ero Preparatoria",
    11: "2do Preparatoria",
    12: "3ero Preparatoria",
    13: "1ero Universidad",
    14: "2do Universidad",
    15: "3ero Universidad",
    16: "4to Universidad",
    17: "Posgrado",
    18: "Posgrado",
};

export enum VIEW_MODES {
    FULL,
    POLIGON,
    LENS
}

export enum POLYGON_MODES {
    VIEW,
    EDIT,
    DELETE
}

export enum TABS {
    VISOR,
    ACCESIBILIDAD,
    POTENCIAL
}

export const VIEW_COLORS_RGBA = {
    VISOR : {
        primary: "rgb(107, 127, 20)",
        secondary: "rgb(163, 177, 108)",
        light: `rgba(200, 255, 200, 1)`,
        dark: "rgba(0, 100, 0, 1)"
    },
    ACCESIBILIDAD : {
        light: `lightblue`,
        dark: "darkblue"
    }
}

export const ACCESSIBILITY_POINTS_COLORS: GenericObject = {
    "education" : "#cc9999",
    "health": "#7c6eb1",
    "recreation":  "#eab642",
    "park": "#7ea48d",
}

export const ZOOM_SHOW_DETAILS = 17;
