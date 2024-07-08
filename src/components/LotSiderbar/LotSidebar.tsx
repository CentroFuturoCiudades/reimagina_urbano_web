import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  CircularProgress,
  CircularProgressLabel,
  Container,
  Heading,
  Icon,
  SimpleGrid,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Switch,
  Tag,
  TagCloseButton,
  TagLabel,
} from "@chakra-ui/react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
import { BiSolidHome } from "react-icons/bi";
import { TbHomeCancel } from "react-icons/tb";
import { FaPerson } from "react-icons/fa6";
import { FaBuilding, FaShoppingCart, FaStethoscope } from "react-icons/fa";
import { MdOutlineRestaurant, MdOutlineWork, MdSchool } from "react-icons/md";

import { renderCustomizedLabel, useFetch } from "../../utils";
import { GenericObject } from "../../types";
import { BLOB_URL } from "../../constants";

interface Feature {
  type: string;
  geometry: {
    type: string;
    coordinates: number[][][];
  };
  properties: {
    POB2010: number;
    [key: string]: any;
  };
}

interface FeatureCollection {
  type: string;
  features: Feature[];
}


interface LotSidebarProps {
  aggregatedInfo?: GenericObject;
  selectedLots: string[];
  setSelectedLots: (arg0: string[]) => void;

  parques: any;
  salud: any;
  educacion: any;
  servicios: any;
  supermercados: any;
  coords: any;
}

const LotSidebar = ({
  aggregatedInfo,
  selectedLots,
  setSelectedLots,
  parques,
  salud,
  educacion,
  servicios,
  supermercados,
  coords
}: LotSidebarProps) => {
  const project = window.location.pathname.split("/")[1];
  const { data } = useFetch(`${BLOB_URL}/${project}/colonias.geojson`);
  const coloniasData = data as FeatureCollection | undefined;

  if (!aggregatedInfo || !coloniasData) return null;

  if (!aggregatedInfo) return null;

  const chartData = [
    {
      name: "Edificación",
      value: aggregatedInfo["building_ratio"],
      color: "rgb(200, 200, 50)",
    },
    {
      name: "Sin uso",
      value: aggregatedInfo["unused_ratio"],
      color: "rgb(100, 100, 200)",
    },
    {
      name: "Vegetación",
      value: aggregatedInfo["green_ratio"],
      color: "rgb(160, 200, 160)",
    },
    {
      name: "Parque",
      value: aggregatedInfo["park_ratio"],
      color: "rgb(40, 200, 40)",
    },
    {
      name: "Estacionamiento",
      value: aggregatedInfo["parking_ratio"],
      color: "rgb(100, 100, 100)",
    },
    {
      name: "Equipamiento",
      value: aggregatedInfo["equipment_ratio"],
      color: "rgb(200, 100, 100)",
    },
  ];

// Función para limpiar la estructura de coords
const limpiarCoords = (coords: number[][][][]): number[][] => {
  return coords.flatMap(lote => lote.flatMap(punto => punto));
};

// Función para obtener la población
const getPopulation = (coloniasData: any, coords: number[][]) => {
  let population = 0;

  if (coloniasData) {
    coords.forEach((punto) => {
      coloniasData.features.forEach((colonia: any) => {
        const coloniaCoords = colonia.geometry.coordinates[0][0];
        console.log(punto)
        coloniaCoords.forEach((coloniaPunto: number[]) => {
          if (
            coloniaPunto[1] === punto[1] && 
            coloniaPunto[0] === punto[0]
          ) {
            population += colonia.properties.POB2010 ?? 0;
          }
        });
      });
    });
  }

  return population;
};

// Ejemplo de uso
const coords2 = [
  [
    [
      [-107.39553742861015, 24.76243764787449]
    ],
    [
      [
        -107.39578543157289, 
        24.759997082746327]
    ]
  ]
]

const cleanedCoords = limpiarCoords(coords);
console.log('Cleaned Coords:', cleanedCoords); // Esto es para verificar el contenido de cleanedCoords
const population = getPopulation(coloniasData, cleanedCoords);
console.log('Population:', population);


  return (
    <>
      <Accordion defaultIndex={[0, 1, 2]} allowMultiple>
        <AccordionItem>
          <AccordionButton>
            <AccordionIcon />
            <Heading size="md">Utilización</Heading>
          </AccordionButton>
          <AccordionPanel pb={4}>
            <SimpleGrid columns={2} style={{ textAlign: "center" }}>
              <Box mx={3}>
                <Stat>
                  <StatLabel>Porcentaje Desperdiciado</StatLabel>
                  <CircularProgress
                    size="80px"
                    value={aggregatedInfo["wasteful_ratio"] * 100}
                    color="red.400"
                  >
                    <CircularProgressLabel>
                      {(aggregatedInfo["wasteful_ratio"] * 100).toFixed(0)}%
                    </CircularProgressLabel>
                  </CircularProgress>
                </Stat>
              </Box>
              <Box mx={3}>
                <Stat>
                  <StatLabel>Porcentaje Subutilizado</StatLabel>
                  <CircularProgress
                    size="80px"
                    value={aggregatedInfo["underutilized_ratio"] * 100}
                    color="red.400"
                  >
                    <CircularProgressLabel>
                      {(aggregatedInfo["underutilized_ratio"] * 100).toFixed(0)}
                      %
                    </CircularProgressLabel>
                  </CircularProgress>
                </Stat>
              </Box>
              <Box mx={3}>
                <Stat>
                  <StatLabel>Porcentaje con carro</StatLabel>
                  <CircularProgress size="80px" value={50} color="red.400">
                    <CircularProgressLabel>
                      {(aggregatedInfo["car_ratio"] * 100).toFixed(0)}%
                    </CircularProgressLabel>
                  </CircularProgress>
                </Stat>
              </Box>
              <Box mx={3}>
                <Stat>
                  <StatLabel>Puntuaje Conectividad</StatLabel>
                  <CircularProgress size="80px" value={50} color="red.400">
                    <CircularProgressLabel>50%</CircularProgressLabel>
                  </CircularProgress>
                </Stat>
              </Box>
            </SimpleGrid>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>
            <AccordionIcon />
            <Heading size="md">Distribución de Uso</Heading>
          </AccordionButton>
          <AccordionPanel pb={4}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart width={200} height={200}>
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  fontSize={1}
                />
                <Pie
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  fill="#8884d8"
                  innerRadius={15}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>
            <AccordionIcon />
            <Heading size="md">Información General</Heading>
          </AccordionButton>
          <AccordionPanel pb={4}>
            <SimpleGrid columns={2} spacing={5}>
              <Stat>
                <StatLabel>Población</StatLabel>
                <StatNumber>
                  <Icon as={FaPerson} />
                  {aggregatedInfo["POBTOT"].toLocaleString("es-MX", {
                    maximumFractionDigits: 0,
                  })}
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Número de Viviendas</StatLabel>
                <StatNumber>
                  <Icon as={BiSolidHome} />
                  {aggregatedInfo["VIVTOT"].toLocaleString("es-MX", {
                    maximumFractionDigits: 0,
                  })}
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Viviendas Deshabitadas</StatLabel>
                <StatNumber>
                  <Icon as={TbHomeCancel} />
                  {aggregatedInfo["VIVPAR_DES"].toLocaleString("es-MX", {
                    maximumFractionDigits: 0,
                  })}
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Número de Establecimientos</StatLabel>
                <StatNumber>
                  <Icon as={FaBuilding} />
                  {aggregatedInfo["num_establishments"].toLocaleString(
                    "es-MX",
                    {
                      maximumFractionDigits: 0,
                    }
                  )}
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Número de Trabajadores</StatLabel>
                <StatNumber>
                  <Icon as={MdOutlineWork} />~
                  {aggregatedInfo["num_workers"].toLocaleString("es-MX", {
                    maximumFractionDigits: 0,
                  })}
                </StatNumber>
              </Stat>
            </SimpleGrid>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>
            <AccordionIcon />
            <Heading size="md">Accesibildad a Servicios</Heading>
          </AccordionButton>
          <AccordionPanel pb={4}>
            <SimpleGrid columns={2} spacing={5}>
              {supermercados.activated && (
                <Stat>
                  <StatLabel>Comercio al por menor</StatLabel>
                  <StatNumber>
                    <Icon as={FaShoppingCart} />
                    {aggregatedInfo["minutes_proximity_comercio"]?.toFixed(
                      0
                    )}{" "}
                    min
                  </StatNumber>
                </Stat>
              )}
              {servicios.activated && (
                <Stat>
                  <StatLabel>Servicios</StatLabel>
                  <StatNumber>
                    <Icon as={FaShoppingCart} />
                    {aggregatedInfo["minutes_proximity_servicios"]?.toFixed(
                      0
                    )}{" "}
                    min
                  </StatNumber>
                </Stat>
              )}
              {salud.activated && (
                <Stat>
                  <StatLabel>Salud</StatLabel>
                  <StatNumber>
                    <Icon as={FaStethoscope} />
                    {aggregatedInfo["minutes_proximity_salud"]?.toFixed(0)} min
                  </StatNumber>
                </Stat>
              )}
              {educacion.activated && (
                <Stat>
                  <StatLabel>Educación</StatLabel>
                  <StatNumber>
                    <Icon as={MdSchool} />
                    {aggregatedInfo["minutes_proximity_educacion"]?.toFixed(
                      0
                    )}{" "}
                    min
                  </StatNumber>
                </Stat>
              )}
              {servicios.activated && (
                <Stat>
                  <StatLabel>Minutos</StatLabel>
                  <StatNumber>
                    <Icon as={MdOutlineRestaurant} />
                    {aggregatedInfo["minutes"]?.toFixed(0)} min
                  </StatNumber>
                </Stat>
              )}
            </SimpleGrid>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default LotSidebar;
