import { GenericObject } from "./types";
import * as d3 from "d3";

export const INITIAL_STATE = {
    zoom: 13,
    transitionDuration: 100,
    maxPitch: 85,
    bearing: 0,
    minZoom: 12,
    maxZoom: 22,
};

export const INITIAL_COORDS: any = {
    "culiacan_centro": {
        latitude: 24.8073,
        longitude: -107.3947,
        zoom: 14,
    },
    "culiacan_sur": {
        latitude: 24.755,
        longitude: -107.40527779958091,
        zoom: 12.5,
    }
}

export const METRIC_DESCRIPTIONS: GenericObject = {
    "poblacion": "Total de habitantes que residen en el área analizada según los últimos datos del censo de INEGI.",
    "grado_escuela": "Información sobre el grado máximo de estudios alcanzado por la población.",
    "viviendas_habitadas": "Viviendas Particulares Habitadas",
    "viviendas_deshabitadas": " Porcentaje de viviendas que no están ocupadas en el área, con base en datos del censo de INEGI.",
    "indice_bienestar": "Medición que clasifica áreas según el nivel de bienestar económico de sus habitantes, considerando factores como ingresos, acceso a servicios y calidad de vida.",
    "viviendas_auto": "Porcentaje de Viviendas con Vehículo Privado",
    "viviendas_pc": "Porcentaje de Viviendas con PC",
    "viviendas_tinaco": "Porcentaje de viviendas que disponen de servicios básicos de bienestar como tinacos.",
    "accessibility_score": "Puntuaje de Accesibilidad (0 a 100)",
    "Pirámide poblacional": "Distribución de la población por grupos de edad y género, representada en una pirámide para observar la estructura demográfica.",
    "services_equipment": "Infraestructura y servicios urbanos disponibles en la zona, como escuelas, hospitales, transporte, parques y centros comunitarios.",
    "Total de equipamientos dentro del área": "Número total de instalaciones y servicios públicos disponibles, tales como escuelas, hospitales y espacios recreativos.",
    "Tipo de equipamientos": "Clasificación de los diferentes tipos de instalaciones urbanas, como centros educativos, de salud, deportivos, culturales, etc.",
    "Radio de cobertura": "Área geográfica en la que los servicios o equipamientos alcanzan a beneficiar a la población.",
    "minutes": "Tiempo promedio que tarda la población en acceder a servicios o equipamientos esenciales.",
    "density": "Relación entre el número de habitantes o viviendas y el área de la zona analizada, normalmente expresada en habitantes o viviendas por kilómetro cuadrado.",
    "max_num_levels": "Altura máxima permitida para los edificios en la zona, según las regulaciones de uso de suelo.",
    "potencial": "Comparación entre el uso actual del suelo y el potencial que podría alcanzarse bajo diferentes condiciones o normativas.",
    "subutilizacion": "Porcentaje de áreas, edificaciones o servicios que no están siendo utilizados a su máxima capacidad.",
    "subutilizacion_type": "Clasificación de los diferentes tipos de espacios que están subutilizados, como terrenos baldíos, edificios vacíos, o espacios infrautilizados en equipamientos públicos.",
    "Pendiente": "Diferencia de altitud en el terreno de la zona, relevante para evaluar accesibilidad y movilidad.",
};

export const formatNumber = (value: number, type: string | undefined = undefined, precision: number = 0) => {
    if (value === null || value === undefined) return "N/A";
    if (type === "percentage") {
        return `${(value * 100).toLocaleString("es-MX", { maximumFractionDigits: precision })}%`;
    } else if (type === "minutes") {
        return `${value.toLocaleString("es-MX", { maximumFractionDigits: precision })} min`;
    } else if (type === "area") {
        return `${value.toLocaleString("es-MX", { maximumFractionDigits: precision })} m²`;
    } else {
        return value.toLocaleString("es-MX", { maximumFractionDigits: precision });
    }
}

export const getQuantiles = (data: any, metric: string): [any, string[]] => {
    if (!data) return [null, []];

    const metricInfo = METRICS_MAPPING[metric] || {};
    const domain = metricInfo.ranges || [
        Math.min(
            ...(Object.values(data) as any).filter(
                (x: number) => x > 0
            )
        ),
        Math.max(...(Object.values(data) as any)),
    ];

    const startColor = metricInfo.startColor || VIEW_COLORS_RGBA.ACCESIBILIDAD.light;
    const endColor = metricInfo.endColor || VIEW_COLORS_RGBA.ACCESIBILIDAD.dark;

    const colors = d3.quantize(
        d3.interpolateRgb(
            startColor,
            endColor
        ),
        metricInfo.ranges ? domain.length - 1 : 5
    );

    const quantiles = metricInfo.ranges ?
        d3.scaleThreshold<number, string>().domain(domain).range([startColor, ...colors]) :
        d3.scaleQuantize<string>().domain(domain).range(colors);

    return [quantiles, colors];
};

export const BLOB_URL = "https://reimaginaurbanostorage.blob.core.windows.net";

export interface MetricInterface {
    query: string;
    title: string;
    ranges?: number[];
    type: "number" | "percentage" | "minutes" | "area";
    startColor?: string;
    endColor?: string;
}

export const METRICS_MAPPING: { [key: string]: MetricInterface } = {
    "poblacion": { query: "pobtot", title: "Población Total", ranges: [0, 65, 80, 100, 130, 800], type: "number" },
    "viviendas_habitadas": { query: "vivpar_hab", title: "Viviendas Particulares Habitadas", ranges: [0, 25, 50, 100, 150, 200], type: "number" },
    "viviendas_deshabitadas": { query: "GREATEST(vivpar_des * 1.0 / NULLIF(vivpar_hab, 0) * 100, 0)", title: "Porcentaje de Viviendas Particulares Deshabitadas", ranges: [0, 10, 20, 30, 40, 100], type: "percentage" }, // rango de 0-89
    "grado_escuela": { query: "graproes", title: "Grado Promedio de Escolaridad", ranges: [6, 9, 10, 12, 16, 18], type: "number" },
    "indice_bienestar": { query: "puntuaje_hogar_digno * 1000", title: "Índice de Bienestar", ranges: [0, 25, 50, 75, 100], type: "percentage" },
    "viviendas_tinaco": { query: "LEAST(vph_tinaco * 1.0 / NULLIF(vivpar_hab, 0) * 100, 100)", title: "Porcentaje de Viviendas con Tinaco", ranges: [0, 15, 30, 60, 90, 100], type: "percentage" },
    "viviendas_pc": { query: "LEAST(vph_pc * 1.0 / NULLIF(vivpar_hab, 0) * 100, 100)", title: "Porcentaje de Viviendas con PC", ranges: [0, 35, 50, 60, 80, 100], type: "percentage" },
    "viviendas_auto":{ query: "LEAST(vph_autom * 1.0 / NULLIF(vivpar_hab, 0) * 100, 100)", title: "Porcentaje de Viviendas con Vehiculo Privado", ranges: [40, 50, 60, 70, 80, 100], type: "percentage" },
    "accessibility_score":{
        query: "accessibility_score",
        title: "Puntuaje de Accesibilidad (0 a 100)",
        ranges: [0, 10, 20, 40, 50, 80],
        type: "number",
    },
    // "area": {
    //     "query": "area",
    //     "title": "Área",
    //     "ranges": [0, 5000, 10000, 20000, 50000, 100000],
    //     type: "area"
    // },
    "cos": {
        query: "cos",
        title: "COS actual",
        ranges: [0, 0.25, 0.5, 0.75, 1],
        type: "number"
    },
    "max_cos": {
        query: "max_cos",
        title: "COS máximo permitido",
        ranges: [0, 0.25, 0.5, 0.75, 1],
        type: "number"
    },
    "minutes": {
        query: "minutes",
        title: "Promedio minutos",
        ranges: [0, 5, 15, 30, 45, 60],
        type: "minutes",
        startColor: "#2C238B",
        endColor: "#BFE5F8"
    },
    "slope": {
        query: "mean_slope",
        title: "Pendiente promedio",
        ranges: [0, 10, 20, 30, 40, 50],
        type: "number"
    },
    //METRICAS POTENCIAL
    "density": { query: "AVG(l.density)", title: "Densidad Actual", ranges: [ 0, 40, 70, 120, 40000 ], type:"number" },
    "max_num_levels": { query: "AVG(l.max_num_levels)", title: "Número maximo de niveles permitidos", type:"number", ranges: [ 0, 3, 5, 8, 12 ] },
    "home_units": { query: "AVG(l.home_units)", title: "Número de viviendas actuales", type:"number"},
    "max_home_units": { query: "AVG(l.max_home_units)", title: "Máximo de Viviendas permitidas", type:"number"},//, ranges: [0, 10, 25, 50, 100, 200] },
    "subutilizacion": { query: "AVG(LEAST( ( 1 - (l.units_estimate * 100.0 / NULLIF(l.max_home_units, 0))), 100))", title: "Subutilización", ranges: [ 0,40,70,90,100], type:"percentage" },
    "subutilizacion_type": { query: "1", title: "Tipos de Espacio Subutilizado", ranges: [ 1,2,3,4], type:"number" },
    "num_levels": { query: "num_levels", title: "Número de Niveles", ranges: [ 0, 0.5, 1, 1.5, 3, 10 ], type:"number" },
}
export const REGIONS = [
    { name: "Zona Sur", key: "culiacan_sur" },
    { name: "Zona Centro", key: "culiacan_centro" },
];
export const amenitiesOptions = [
    // Salud
    { value: 'Hospital_general', label: 'Hospital general', type: 'health' },
    { value: 'Consultorios_medicos', label: 'Consultorios médicos', type: 'health' },
    { value: 'Farmacia', label: 'Farmacia', type: 'health' },
    // Recreativo
    { value: 'Parques_recreativos', label: 'Parques recreativos', type: 'park' },
    { value: 'Clubs_deportivos_y_acondicionamiento_fisico', label: 'Clubs deportivos y de acondicionamiento físico', type: 'recreation' },
    { value: 'Cine', label: 'Cine', type: 'recreation' },
    { value: 'Otros_servicios_recreativos', label: 'Otros servicios recreativos', type: 'recreation' },
    // Educación
    { value: 'Guarderia', label: 'Guarderia', type: 'education' },
    { value: 'Educacion_preescolar', label: 'Educación preescolar', type: 'education' },
    { value: 'Educacion_primaria', label: 'Educación primaria', type: 'education' },
    { value: 'Educacion_secundaria', label: 'Educación secundaria', type: 'education' },
    { value: 'Educacion_media_superior', label: 'Educación media superior', type: 'education' },
    { value: 'Educacion_superior', label: 'Educación superior', type: 'education' },
    // Otros
    { value: 'Capilla', label: 'Capilla', type: 'other' },
    { value: 'Comedor', label: 'Comedor', type: 'other' },
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
        light: `#BFE5F8`,
        dark: "#2C238B"
    }
}

export const ACCESSIBILITY_POINTS_COLORS: GenericObject = {
    "education" : "#cc9999",
    "health": "#7c6eb1",
    "recreation":  "#eab642",
    "park": "#7ea48d",
    "other": "gray"
}

export const ZOOM_SHOW_DETAILS = 16;
