import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  CircularProgress,
  CircularProgressLabel,
  Heading,
  Icon,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Text
} from "@chakra-ui/react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
import { BiSolidHome } from "react-icons/bi";
import { TbHomeCancel } from "react-icons/tb";
import { FaPerson, FaMoneyBill, FaHouseUser, FaPersonBreastfeeding } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { FaBuilding, FaShoppingCart, FaStethoscope } from "react-icons/fa";
import { MdOutlineRestaurant, MdOutlineWork, MdSchool } from "react-icons/md";
import { useState } from "react";

import { renderCustomizedLabel } from "../../utils";
import { GenericObject } from "../../types";
import PopulationPyramid from "../PopulationPyramid";
import "./LotSidebar.scss";

interface LotSidebarProps {
  aggregatedInfo?: GenericObject;
  selectedLots: string[];
  setSelectedLots: (arg0: string[]) => void;
  parques: any;
  salud: any;
  educacion: any;
  servicios: any;
  supermercados: any;
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
}: LotSidebarProps) => {
  const [showPopulationCharts, setShowPopulationCharts] = useState(false);

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

  const pyramidData = aggregatedInfo ? [
    { age: "0-2", male: aggregatedInfo.P_0A2_M, female: aggregatedInfo.P_0A2_F, total: aggregatedInfo.P_0A2_M + aggregatedInfo.P_0A2_F },
    { age: "3-5", male: aggregatedInfo.P_3A5_M, female: aggregatedInfo.P_3A5_F, total: aggregatedInfo.P_3A5_M + aggregatedInfo.P_3A5_F },
    { age: "6-11", male: aggregatedInfo.P_6A11_M, female: aggregatedInfo.P_6A11_F, total: aggregatedInfo.P_6A11_M + aggregatedInfo.P_6A11_F },
    { age: "12-14", male: aggregatedInfo.P_12A14_M, female: aggregatedInfo.P_12A14_F, total: aggregatedInfo.P_12A14_M + aggregatedInfo.P_12A14_F },
    { age: "15-17", male: aggregatedInfo.P_15A17_M, female: aggregatedInfo.P_15A17_F, total: aggregatedInfo.P_15A17_M + aggregatedInfo.P_15A17_F },
    { age: "18-24", male: aggregatedInfo.P_18A24_M, female: aggregatedInfo.P_18A24_F, total: aggregatedInfo.P_18A24_M + aggregatedInfo.P_18A24_F },
    { age: "25-59", male: aggregatedInfo.P_25A59_M, female: aggregatedInfo.P_25A59_F, total: aggregatedInfo.P_25A59_M + aggregatedInfo.P_25A59_F },
    { age: "60+", male: aggregatedInfo.P_60YMAS_M, female: aggregatedInfo.P_60YMAS_F, total: aggregatedInfo.P_60YMAS_M + aggregatedInfo.P_60YMAS_F },
  ] : [];

  const puntajeHogarDigno = aggregatedInfo["puntuaje_hogar_digno"]?.toFixed(2);
  const pobPorCuarto = aggregatedInfo["pob_por_cuarto"]?.toFixed(1);
  const graproes = aggregatedInfo["GRAPROES"] ? Math.round(aggregatedInfo["GRAPROES"]) : 0;
  const pafil_ipriv = aggregatedInfo["PAFIL_IPRIV"] ? Math.round(aggregatedInfo["PAFIL_IPRIV"]).toLocaleString("es-MX") : "0";
  
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
            <Heading size="md">Accesibilidad a Servicios</Heading>
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
        <AccordionItem>
          <AccordionButton onClick={() => setShowPopulationCharts(!showPopulationCharts)}>
            <AccordionIcon />
            <Heading size="md">Perfil poblacional</Heading>
          </AccordionButton>
          <AccordionPanel pb={4}>
            {showPopulationCharts && (
              <>
                <Box className="section-header">
                  <Text className="section-title">Población total</Text>
                </Box>
                <Box className="total-population">
                  <Icon as={FaPerson} />
                  <Text className="population-number">
                    {aggregatedInfo["POBTOT"].toLocaleString("es-MX", {
                      maximumFractionDigits: 0,
                    })}
                    hab
                  </Text>
                </Box>

                <Box className="section-header">
                  <Text className="section-title">Pirámide poblacional</Text>
                </Box>
                <PopulationPyramid data={pyramidData} />

                <Box className="section-header">
                  <Text className="section-title">Grado promedio escolaridad</Text>
                </Box>
                <Box className="school-degree">
                  <Icon as={MdSchool} />
                  <Text className="degree-number">
                    {graproes}
                  </Text>
                </Box>

                <Box className="section-header">
                  <Text className="section-title">Acceso a seguro médico privado</Text>
                </Box>
                <Box className="health-access">
                  <Icon as={FaStethoscope} />
                  <Text className="health-number">
                    {pafil_ipriv}
                  </Text>
                </Box>

                <Box className="section-header">
                  <Text className="section-title">Puntuaje de Bienestar</Text>
                </Box>
                <Box className="puntuaje_hogar_digno">
                  <Icon as={FaPersonBreastfeeding} />
                  <Text className="puntuaje_hogar_digno">
                    {puntajeHogarDigno}%
                  </Text>
                </Box>

                <Box className="section-header">
                  <Text className="section-title">Promedio de población por cuarto</Text>
                </Box>
                <Box className="population-per-room">
                  <Icon as={FaHome} />
                  <Text className="population-number">
                    {pobPorCuarto} Personas
                  </Text>
                </Box>
                <Box className="section-header">
                  <Text className="section-title">% Población con carro</Text>
                </Box>
                <Box className="car-population">
                  <CircularProgress
                    size="100px"
                    value={aggregatedInfo["car_ratio"] * 100}
                    color="red.400"
                  >
                    <CircularProgressLabel>
                      {(aggregatedInfo["car_ratio"] * 100).toFixed(0)}%
                    </CircularProgressLabel>
                  </CircularProgress>
                </Box>
              </>
            )}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default LotSidebar;