import { Icon, SimpleGrid, Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import React from "react";
import { BiSolidHome } from "react-icons/bi";
import { FaBuilding, FaPerson } from "react-icons/fa6";
import { MdOutlineWork } from "react-icons/md";
import { TbHomeCancel } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { setQueryMetric } from "../features/queryMetric/queryMetricSlice";

const Visor = ( { metrics }: { metrics: any }) =>{

    const dispatch = useDispatch()

    const configureMetric = ( metric: string ) => {
        dispatch( setQueryMetric( metric ) );
    }

    return (
        <div>
            { metrics && Object.keys( metrics ).length &&
            <>
                <SimpleGrid columns={2} spacing={5}>
                    <Stat onClick={ ()=>{ configureMetric("POBTOT") } }>
                        <StatLabel>Población</StatLabel>
                        <StatNumber>
                        <Icon as={FaPerson} />
                        {metrics["POBTOT"].toLocaleString("es-MX", {
                            maximumFractionDigits: 0,
                        })}
                        </StatNumber>
                    </Stat>
                    <Stat onClick={ ()=>{ configureMetric("VIVTOT") } } >
                        <StatLabel>Número de Viviendas</StatLabel>
                        <StatNumber>
                        <Icon as={BiSolidHome} />
                        {metrics["VIVTOT"].toLocaleString("es-MX", {
                            maximumFractionDigits: 0,
                        })}
                        </StatNumber>
                    </Stat>
                    <Stat onClick={ ()=>{ configureMetric("VIVPAR_DES") } }>
                        <StatLabel>Viviendas Deshabitadas</StatLabel>
                        <StatNumber>
                        <Icon as={TbHomeCancel} />
                        {metrics["VIVPAR_DES"].toLocaleString("es-MX", {
                            maximumFractionDigits: 0,
                        })}
                        </StatNumber>
                    </Stat>
                    <Stat onClick={ ()=>{ configureMetric("num_establishments") } } >
                        <StatLabel>Número de Establecimientos</StatLabel>
                        <StatNumber>
                        <Icon as={FaBuilding} />
                        {metrics["num_establishments"].toLocaleString(
                            "es-MX",
                            {
                            maximumFractionDigits: 0,
                            }
                        )}
                        </StatNumber>
                    </Stat>
                    <Stat onClick={ ()=>{ configureMetric("num_workers") } } >
                        <StatLabel>Número de Trabajadores</StatLabel>
                        <StatNumber>
                        <Icon as={MdOutlineWork} />~
                        {metrics["num_workers"].toLocaleString("es-MX", {
                            maximumFractionDigits: 0,
                        })}
                        </StatNumber>
                    </Stat>
                </SimpleGrid>
            </>
            }
        </div>
    );
}

export default Visor;
