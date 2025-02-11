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
    culiacan_centro: {
        latitude: 24.8073,
        longitude: -107.3947,
        zoom: 14,
    },
    culiacan_sur: {
        latitude: 24.755,
        longitude: -107.40527779958091,
        zoom: 12.5,
    },
};

export const METRIC_DESCRIPTIONS: GenericObject = {
    poblacion: "Total de habitantes en la zona, según el Censo 2020 del INEGI.",
    per_group_ages:
        "Porcentaje de la población en la zona que pertenece a los rangos de edad seleccionados, según el Censo 2020 del INEGI.",
    grado_escuela:
        "Promedio del último grado de estudios alcanzado por los habitantes en la zona, según el Censo 2020 del INEGI. Esta variable es relevante porque se relaciona con el nivel de ingresos del hogar.",
    viviendas_habitadas_percent:
        "Porcentaje de viviendas habitadas en la zona, según el Censo 2020 del INEGI.",
    viviendas_deshabitadas_percent:
        "Porcentaje de viviendas deshabitadas en la zona, según el Censo 2020 del INEGI.",
    indice_bienestar:
        "Índice de bienestar económico en la zona (0 a 100) basado en el acceso a servicios esenciales en los hogares, donde valores más altos indican mejores condiciones. Este indicador es importante porque se relaciona con el nivel de ingresos del hogar.",
    viviendas_auto:
        "Porcentaje de viviendas en la zona que cuentan con al menos un vehículo privado, según el Censo 2020 del INEGI.",
    viviendas_pc:
        "Porcentaje de viviendas en la zona que cuentan con al menos una computadora personal, según el Censo 2020 del INEGI.",
    viviendas_tinaco:
        "Porcentaje de viviendas en la zona que cuentan con un tinaco para almacenamiento de agua, según el Censo 2020 del INEGI.",
    minutes:
        "Tiempo promedio que la población en la zona tarda en llegar a un equipamiento esencial. Para cada tipo de equipamiento seleccionado, se identifica la opción más cercana a cada hogar y, entre estas, se elige la que tiene el mayor tiempo de acceso. La estimación se realiza considerando la red de calles de OpenStreetMap y asumiendo un desplazamiento a pie de 80 metros por minuto.",
    accessibility_score: "Puntaje de accesibilidad en la zona (0 a 100) basado en un modelo gravitacional que mide la facilidad de acceso a equipamientos esenciales. Se asigna mayor peso a los equipamientos cercanos y con mayor capacidad de atención, como un hospital grande o un parque amplio. El cálculo considera las distancias en la red de calles de OpenStreetMap para estimar la distancia desde los hogares hasta los equipamientos.",
    slope: "Promedio de la inclinación de las vialidades en la zona (en grados), calculado con la red de calles de OpenStreetMap y datos topográficos SRTMGL1 v003 de la NASA.",
    area: "Área total de las manzanas o predios en la zona (hectáreas).",
    cos: "Promedio del Coeficiente de Ocupación del Suelo (COS) observable en la zona. Representa la proporción del terreno ocupada por construcciones (0 a 1), donde valores más altos indican mayor aprovechamiento del suelo. Datos obtenidos de footprints de OpenBuildings v3 de Google.",
    max_cos:
        "Promedio del COS máximo permitido por la regulación vigente en la zona (0 a 1), donde valores cercanos a 1 indican que la normativa permite construir en casi todo el terreno.",
    cus: "Promedio del Coeficiente de Uso del Suelo (CUS) observable en la zona. Indica cuántas veces se puede construir el área total del terreno en función del número de niveles permitidos. Valores mayores indican mayor intensidad de construcción. Datos obtenidos de footprints de OpenBuildings v3 de Google.",
    max_cus:
        "Promedio del CUS máximo permitido por la regulación vigente en la zona. Determina cuántas veces el área del terreno puede ser edificada en distintos niveles.",
    num_levels:
        "Promedio del número de niveles observados en los edificios de la zona. Datos obtenidos de alturas de OpenBuildings 2.5D de Google.",
    max_num_levels:
        "Promedio del número máximo de niveles permitidos por la regulación vigente en la zona.",
    density:
        "Densidad habitacional promedio en la zona (viviendas por hectárea).",
    max_density:
        "Densidad habitacional máxima permitida por la regulación vigente en la zona (viviendas por hectárea).",
    home_units:
        "Número total de viviendas observadas en la zona, según el Censo 2020 del INEGI.",
    max_home_units:
        "Número máximo de viviendas que podrían construirse en la zona según la normativa vigente.",
    subutilizacion:
        "Índice de subutilización en la zona (0 a 100), que mide cuántas viviendas podrían haberse construido según la normativa, pero aún no han sido edificadas. Este indicador es importante porque ayuda a identificar oportunidades para desarrollos de vivienda.",
};

export const formatNumber = (
    value: number,
    type: string | undefined = undefined,
    precision: number = 0
) => {
    if (value === null || value === undefined) return "N/A";
    if (type === "percentage") {
        return `${(value * 100).toLocaleString("es-MX", {
            maximumFractionDigits: precision,
        })}%`;
    } else if (type === "minutes") {
        return `${value.toLocaleString("es-MX", {
            maximumFractionDigits: precision,
        })} min`;
    } else if (type === "area") {
        return `${value.toLocaleString("es-MX", {
            maximumFractionDigits: precision,
        })} m²`;
    } else if (type === "float") {
        return value.toLocaleString("es-MX", { maximumFractionDigits: 2 });
    } else {
        return value.toLocaleString("es-MX", {
            maximumFractionDigits: precision,
        });
    }
};

export const getQuantiles = (data: any, metric: string): [any, string[]] => {
    if (!data) return [null, []];

    const metricInfo = METRICS_MAPPING[metric] || {};
    const domain = metricInfo.ranges || [
        Math.min(...(Object.values(data) as any).filter((x: number) => x > 0)),
        Math.max(...(Object.values(data) as any)),
    ];

    const startColor =
        metricInfo.startColor || VIEW_COLORS_RGBA.ACCESIBILIDAD.light;
    const endColor = metricInfo.endColor || VIEW_COLORS_RGBA.ACCESIBILIDAD.dark;

    const colors = d3.quantize(
        d3.interpolateRgb(startColor, endColor),
        metricInfo.ranges ? domain.length - 1 : 5
    );

    const quantiles = metricInfo.ranges
        ? d3
              .scaleThreshold<number, string>()
              .domain(domain)
              .range([startColor, ...colors])
        : d3.scaleQuantize<string>().domain(domain).range(colors);

    return [quantiles, colors];
};

// export const transformToOrganicNumbers = (numbers: number[]): number[] => {
//     if (numbers.length === 0) return [];

//     // Sort the numbers to handle them in order
//     const sortedNumbers = [...numbers].sort((a, b) => a - b);

//     // Calculate differences between consecutive numbers
//     const differences: number[] = [];
//     for (let i = 1; i < sortedNumbers.length; i++) {
//         const diff = sortedNumbers[i] - sortedNumbers[i - 1];
//         if (diff > 0) differences.push(diff);
//     }

//     // If all differences are zero, return the original numbers
//     if (differences.length === 0) return sortedNumbers;

//     // Find the smallest non-zero difference
//     const minDifference = Math.min(...differences);

//     // Define sensible rounding bases in ascending order
//     const sensibleBases = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];

//     // Find the smallest sensible base greater than or equal to the minDifference
//     let roundingBase = sensibleBases.find((base) => base >= minDifference);
//     if (!roundingBase) {
//         // If all sensible bases are smaller, use the largest possible
//         roundingBase = sensibleBases[sensibleBases.length - 1];
//     }

//     // Round each number to the nearest multiple of the rounding base
//     const roundedNumbers: number[] = [];
//     let previousRounded: number | null = null;

//     for (const num of sortedNumbers) {
//         let rounded = Math.round(num / roundingBase) * roundingBase;

//         // Avoid clustering: if the current rounded is the same as previous, adjust it
//         if (previousRounded !== null && rounded <= previousRounded) {
//             rounded = previousRounded + roundingBase;
//         }

//         roundedNumbers.push(rounded);
//         previousRounded = rounded;
//     }

//     return roundedNumbers;
// };

export const transformToOrganicNumbers = (numbers: number[]): number[] => {
    if (numbers.length === 0) return [];

    // Sort the numbers to handle them in order
    const sortedNumbers = [...numbers].sort((a, b) => a - b);

    // Calculate differences between consecutive numbers
    const differences: number[] = [];
    for (let i = 1; i < sortedNumbers.length; i++) {
        const diff = sortedNumbers[i] - sortedNumbers[i - 1];
        if (diff > 0) differences.push(diff);
    }

    // If all differences are zero, return the original numbers
    if (differences.length === 0) return sortedNumbers;

    // Find the smallest non-zero difference
    const minDifference = Math.min(...differences);

    // Generate a comprehensive list of sensible bases including decimals
    const sensibleBases: number[] = [];
    for (let exp = -3; exp <= 5; exp++) { // Covers 0.001 to 100000
        const magnitude = Math.pow(10, exp);
        [1, 2, 5].forEach(base => sensibleBases.push(base * magnitude));
    }
    sensibleBases.sort((a, b) => a - b);

    // Determine the rounding base based on the minDifference
    let roundingBase: number;
    if (minDifference < 1) {
        // For decimals, use the largest base <= minDifference
        const possibleBases = sensibleBases.filter(base => base <= minDifference);
        roundingBase = possibleBases.length > 0 
            ? possibleBases[possibleBases.length - 1] 
            : sensibleBases[0];
    } else {
        // For larger numbers, use the smallest base >= minDifference
        roundingBase = sensibleBases.find(base => base >= minDifference) 
            || sensibleBases[sensibleBases.length - 1];
    }

    // Round each number and adjust for clustering
    const roundedNumbers: number[] = [];
    let previousRounded: number | null = null;

    for (const num of sortedNumbers) {
        let rounded = Math.round(num / roundingBase) * roundingBase;

        // Adjust to avoid clustering
        if (previousRounded !== null && rounded <= previousRounded) {
            rounded = previousRounded + roundingBase;
        }

        roundedNumbers.push(rounded);
        previousRounded = rounded;
    }

    return roundedNumbers;
}

export const _getQuantiles = (
    quantiles: number[],
    metric: string
): [any, string[]] => {
    const metricInfo = METRICS_MAPPING[metric] || {};
    const startColor =
        metricInfo.startColor || VIEW_COLORS_RGBA.ACCESIBILIDAD.light;
    const endColor = metricInfo.endColor || VIEW_COLORS_RGBA.ACCESIBILIDAD.dark;

    const colors = d3.quantize(
        d3.interpolateRgb(startColor, endColor),
        quantiles.length - 1
    );

    const _quantiles = d3
        .scaleThreshold<number, string>()
        .domain(quantiles)
        .range([startColor, ...colors]);

    return [_quantiles, colors];
};

export const BLOB_URL = "https://reimaginaurbanostorage.blob.core.windows.net";

export interface MetricInterface {
    title: string;
    ranges?: number[];
    type: "number" | "percentage" | "minutes" | "area" | "float";
    startColor?: string;
    endColor?: string;
}

export const METRICS_MAPPING: { [key: string]: MetricInterface } = {
    poblacion: {
        title: "Población total",
        type: "number",
    },
    viviendas_habitadas_percent: {
        title: "Porcentaje de viviendas particulares habitadas",
        type: "percentage",
    },
    viviendas_deshabitadas: {
        title: "Porcentaje de viviendas particulares deshabitadas",
        type: "percentage",
    }, // rango de 0-89
    grado_escuela: {
        title: "Grado promedio de escolaridad",
        type: "number",
    },
    indice_bienestar: {
        title: "Índice de bienestar",
        type: "percentage",
    },
    viviendas_tinaco: {
        title: "Porcentaje de viviendas con tinaco",
        type: "percentage",
    },
    viviendas_pc: {
        title: "Porcentaje de viviendas con PC",
        type: "percentage",
    },
    viviendas_auto: {
        title: "Porcentaje de viviendas con vehiculo privado",
        type: "percentage",
    },
    accessibility_score: {
        title: "Puntaje de accesibilidad (0 a 100)",
        type: "number",
    },
    per_female_group_ages: {
        title: "Rango de edades de mujeres",
        type: "percentage",
    },
    per_male_group_ages: {
        title: "Rango de edades de hombres",
        type: "percentage",
    },
    per_group_ages: {
        title: "Porcentaje población rango edad",
        type: "percentage",
    },
    area: {
        title: "Área",
        type: "area",
    },
    cos: {
        title: "COS observado",
        type: "float",
    },
    max_cos: {
        title: "COS máximo permitido",
        type: "float",
    },
    minutes: {
        title: "Promedio minutos",
        type: "minutes",
        startColor: "#2C238B",
        endColor: "#BFE5F8",
    },
    slope: {
        title: "Pendiente promedio",
        type: "number",
    },
    cus: {
        title: "CUS observado",
        type: "float",
    },
    max_cus: {
        title: "CUS máximo permitido",
        type: "float",
    },
    //METRICAS POTENCIAL
    density: {
        title: "Densidad observada",
        type: "number",
    },
    max_density: {
        title: "Densidad máxima permitida",
        type: "number",
    },
    max_num_levels: {
        title: "Número de niveles máximos permitidos",
        type: "number",
    },
    home_units: {
        title: "Número de viviendas observadas",
        type: "number",
    },
    max_home_units: {
        title: "Máximo de Viviendas permitidas",
        type: "number",
    },
    subutilizacion: {
        title: "Índice de Subutilización",
        type: "percentage",
    },
    subutilizacion_type: {
        title: "Tipos de espacio subutilizado",
        type: "number",
    },
    num_levels: {
        title: "Número de niveles observados",
        type: "number",
    },
};
export const REGIONS = [
    { name: "Zona Sur", key: "culiacan_sur" },
    { name: "Zona Centro", key: "culiacan_centro" },
];
export const amenitiesOptions = [
    // Salud
    { value: "Hospital_general", label: "Hospital general", type: "health" },
    {
        value: "Consultorios_medicos",
        label: "Consultorios médicos",
        type: "health",
    },
    { value: "Farmacia", label: "Farmacia", type: "health" },
    // Recreativo
    {
        value: "Parques_recreativos",
        label: "Parques recreativos",
        type: "park",
    },
    {
        value: "Clubs_deportivos_y_acondicionamiento_fisico",
        label: "Clubs deportivos y de acondicionamiento físico",
        type: "recreation",
    },
    { value: "Cine", label: "Cine", type: "recreation" },
    {
        value: "Otros_servicios_recreativos",
        label: "Otros servicios recreativos",
        type: "recreation",
    },
    // Educación
    { value: "Guarderia", label: "Guarderia", type: "education" },
    {
        value: "Educacion_preescolar",
        label: "Educación preescolar",
        type: "education",
    },
    {
        value: "Educacion_primaria",
        label: "Educación primaria",
        type: "education",
    },
    {
        value: "Educacion_secundaria",
        label: "Educación secundaria",
        type: "education",
    },
    {
        value: "Educacion_media_superior",
        label: "Educación media superior",
        type: "education",
    },
    {
        value: "Educacion_superior",
        label: "Educación superior",
        type: "education",
    },
    // Otros
    { value: "Capilla", label: "Capilla", type: "other" },
    { value: "Comedor", label: "Comedor", type: "other" },
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
    LENS,
}

export enum POLYGON_MODES {
    VIEW,
    EDIT,
    DELETE,
}

export enum TABS {
    VISOR,
    ACCESIBILIDAD,
    POTENCIAL,
}

export const VIEW_COLORS_RGBA = {
    VISOR: {
        primary: "rgb(107, 127, 20)",
        secondary: "rgb(163, 177, 108)",
        light: `rgba(200, 255, 200, 1)`,
        dark: "rgba(0, 100, 0, 1)",
    },
    ACCESIBILIDAD: {
        light: `#BFE5F8`,
        dark: "#2C238B",
    },
};

export const ACCESSIBILITY_POINTS_COLORS: GenericObject = {
    education: "#cc9999",
    health: "#7c6eb1",
    recreation: "#eab642",
    park: "#7ea48d",
    other: "gray",
};

export const ZOOM_SHOW_DETAILS = 16;
