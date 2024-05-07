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
  bearing: 0,
  minZoom: 8.5,
};

export const COLUMN_MAPPING = {
  ID: "Clave de Lote",
  POBTOT: "Población Total",
  TVIVHAB: "Total de Viviendas Habitadas",
  VIVPAR_DES: "Viviendas Particulares Deshabitadas",
  VIVTOT: "Viviendas Totales",
  VPH_AUTOM: "Viviendas con Automóvil",
  building_area: "Área de Edificación",
  building_ratio: "Ratio de Edificación",
  equipment_area: "Área de Equipamiento",
  equipment_ratio: "Ratio de Equipamiento",
  park_area: "Área de Parque",
  park_ratio: "Ratio de Parque",
  green_area: "Área Verde",
  green_ratio: "Ratio de Área Verde",
  parking_area: "Área de Estacionamiento",
  parking_ratio: "Ratio de Estacionamiento",
  unused_area: "Área sin Utilizar",
  unused_ratio: "Ratio de Área sin Utilizar",
  num_establishments: "Número de Establecimientos",
  num_workers: "Número de Trabajadores",
  comercio: "Comercio",
  educacion: "Educación",
  salud: "Salud",
  servicios: "Servicios",
  services_nearby: "Servicios Cercanos",
  underutilized_area: "Área subutilizada",
  underutilized_ratio: "Ratio de Subutilización",
  wasteful_area: "Área Desperdiciada",
  wasteful_ratio: "Ratio de Área Desperdiciada",
  combined_score: "Puntuación Combinada",
  minutes: "Minutos",
  accessibility: "Accesibilidad",
};
