import { GenericObject } from "./types";
import { generateGradientColors } from "./utils";

export const API_URL = "http://127.0.0.1:8000";
export const startColor = "#bdddff";
export const endColor = "#1A57FF";
export const AMOUNT = 8;
export const COLORS = generateGradientColors(startColor, endColor, AMOUNT);

export const INITIAL_STATE = {
    latitude: 25.65,
    longitude: -100.287419,
    zoom: 15,
    transitionDuration: 100,
    pitch: 60,
    maxPitch: 85,
    bearing: 0,
    minZoom: 12,
    maxZoom: 22,
};

export const BLOB_URL = "https://reimaginaurbanostorage.blob.core.windows.net";

export const COLUMN_MAPPING: GenericObject = {
  ID: "Clave de Lote",
  GRAPROES: "Grado Promedio de Escolaridad",
  PYRAMID: "Pirámide Poblacional",
  POBTOT: "Población Total",
  TVIVHAB: "Total de Viviendas Habitadas",
  VIVPAR_HAB: "Viviendas Habitadas",
  VIVPAR_DES: "Viviendas Deshabitadas",
  VIVTOT: "Viviendas Totales",
  VPH_AUTOM: "Viviendas con Automóvil",
  VPH_TINACO: "Viviendas con Tinaco",
  VPH_PC: "Viviendas con Computadora",
  wellness_index: "Índice de Bienestar",
  building_area: "Área de Edificación",
  building_ratio: "Porcentaje de Edificación",
  equipment_area: "Área de Equipamiento",
  equipment_ratio: "Porcentaje de Equipamiento",
  park_area: "Área de Parque",
  park_ratio: "Porcentaje de Parque",
  green_area: "Área con vegetación",
  green_ratio: "Porcentaje de Área con Vegetación",
  parking_area: "Área de Estacionamiento",
  parking_ratio: "Porcentaje de Estacionamiento",
  unused_area: "Área sin Utilizar",
  unused_ratio: "Porcentaje de Área sin Utilizar",
  num_establishments: "Número de Establecimientos",
  num_workers: "Número de Trabajadores",
  comercio: "Comercio",
  educacion: "Educación",
  salud: "Salud",
  servicios: "Servicios",
  services_nearby: "Servicios Cercanos",
  underutilized_area: "Área subutilizada",
  underutilized_ratio: "Porcentaje de Subutilización",
  wasteful_area: "Área Desperdiciada",
  wasteful_ratio: "Porcentaje de Área Desperdiciada",
  combined_score: "Puntuación Combinada",
  minutes: "Minutos",
  accessibility: "Accesibilidad",
  PEA: "Población Económicamente Activa",
  P_0A5: "Población de 0 a 5 años",
  P_65MAS: "Población de 65 años y más",
  max_home_units: "Unidades Máximas de Vivienda",
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

export const ZOOM_SHOW_DETAILS = 17;