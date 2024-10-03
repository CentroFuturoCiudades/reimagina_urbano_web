import React, { forwardRef } from "react";
import { Box, Heading, Text, SimpleGrid } from "@chakra-ui/react";

const Section2 = forwardRef<HTMLDivElement>((props, ref) => {
    return (
    <Box
    ref={ref}
    h="100vh"
    bg="blue.500"
    display="flex"
    justifyContent="center"
    alignItems="center"
    scrollSnapAlign="start" // Snap this section to the top
    >
    <SimpleGrid columns={[1, 3]} spacing={20}>

        <Box px={10}>
            <Heading fontSize={"3vw"} color={"white"}>
                Visor
            </Heading>
            <Heading fontSize={"1.5vw"} color={"white"} mb={12}>
                Mapeando la realidad
            </Heading>
            <Text color={"white"} mb={8} fontSize={"lg"}>
                Visor es una herramienta clave para
                comprender la realidad demográfica,
                social y económica de las áreas
                seleccionadas. A través del análisis
                detallado de perfiles sociodemográficos,
                como la población total, la pirámide
                poblacional y el nivel educativo, así como
                de perfiles socioeconómicos que
                incluyen la disponibilidad de servicios de
                salud, bienestar y el índice de bienestar
                económico, los usuarios pueden obtener
                una visión completa del contexto de la
                zona en estudio.
            </Text>
            <Text color={"white"} fontSize={"lg"}>
                Este conocimiento es fundamental para la
                correcta planificación y ejecución de
                políticas públicas, proyectos de
                infraestructura y desarrollo social. Al
                entender la composición y las
                necesidades específicas de la población,
                se pueden diseñar intervenciones más
                efectivas que respondan a las realidades
                locales.
            </Text>
        </Box>

        <Box px={10}>
            <Heading fontSize={"3vw"} color={"white"}>
                Accesibilidad
            </Heading>
            <Heading fontSize={"1.5vw"} color={"white"} mb={12}>
                Más allá de la cercanía
            </Heading>
            <Text color={"white"} mb={8} fontSize={"lg"}>
                Una vez comprendido el perfil de la zona,
                es crucial evaluar las características
                físicas y la accesibilidad a los servicios
                urbanos disponibles. La accesibilidad se
                refiere no solo a la proximidad de
                servicios y equipamientos, sino también a
                factores como el radio de cobertura, el
                tiempo de traslado, y las posibles
                barreras físicas como desniveles del
                terreno. 
            </Text>
            <Text color={"white"} fontSize={"lg"}>
                Estos elementos son determinantes para
                entender las limitaciones urbanas y
                sociales que podrían afectar la movilidad
                y el acceso equitativo a recursos
                esenciales. Además, analizar la
                utilización de los equipamientos
                existentes y los tipos de servicios
                disponibles permite identificar áreas
                donde la oferta podría estar desajustada
                a la demanda, lo que es vital para la
                planificación de mejoras en la
                infraestructura urbana y la calidad de
                vida de los habitantes.
            </Text>
        </Box>

        <Box px={10}>
            <Heading fontSize={"3vw"} color={"white"}>
                Potencial
            </Heading>
            <Heading fontSize={"1.5vw"} color={"white"} mb={12}>
                Desbloqueando oportunidades
            </Heading>
            <Text color={"white"} mb={8} fontSize={"lg"}>
                El análisis del potencial urbano se centra
                en maximizar el uso eficiente del suelo y
                el desarrollo sostenible de las áreas
                urbanas. Este apartado evalúa las
                densidades poblacionales, las alturas
                máximas permitidas y compara la
                situación actual con el potencial de
                desarrollo de la zona. También se enfoca
                en la identificación de áreas
                subutilizadas que podrían ser
                optimizadas para satisfacer las
                necesidades urbanas en crecimiento. 
            </Text>
            <Text color={"white"} fontSize={"lg"}>
                Al explorar el porcentaje de
                subutilización y los tipos de espacios
                subutilizados, los planificadores urbanos
                pueden detectar oportunidades para
                desarrollar nuevos proyectos
                residenciales, comerciales o de
                infraestructura que mejoren la
                funcionalidad y estética de la ciudad.
                Este enfoque promueve un crecimiento
                urbano equilibrado y sostenible, que no
                solo responde a las necesidades
                actuales, sino que también se anticipa a
                las futuras demandas de la comunidad.
            </Text>
        </Box>
        
    </SimpleGrid>
    </Box>
    );
});

export default Section2;
