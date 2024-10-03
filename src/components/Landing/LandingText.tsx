import React, { useRef, useState, useEffect, forwardRef } from "react";
import { Box, Text, Heading, VStack, SimpleGrid, Center, Button, calc } from "@chakra-ui/react";
import { MainSidebar, BaseMap } from "../";


const Section1 = forwardRef<HTMLDivElement>((props, ref) => {
    return (
        <Box
          ref={ref}
          h="100vh"
          w="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          bgImage={"url('/images/reImaginaBG.png')"}
        >
            <Center w="60%" color='white'>
                <Heading as='h1' fontSize={"8vw"} noOfLines={2} textAlign={"center"}>
                    reIMAGINA URBANO
                </Heading>
            </Center>
        </Box>
    );
});

const Section2 = forwardRef<HTMLDivElement, { calcOpacity: number }>((props, ref) => {
    const { calcOpacity } = props; 
    return (
        <>
            <Box
            ref={ref}
            opacity={calcOpacity}
            h="100vh"
            w="100%"  
            bgImage={"url('/images/reImaginaBG.png')"}  
            >
            <SimpleGrid columns={[1, 3]} position={"sticky"} top={0}>

                <Box px={10} >
                    <Heading fontSize={"3vw"} color={"white"}>
                        Visor
                    </Heading>
                    <Heading fontSize={"1.5vw"} color={"white"} mb={12}>
                        Mapeando la realidad
                    </Heading>
                    <Text color={"white"} mb={4} fontSize={"sm"}>
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
                    <Text color={"white"} fontSize={"sm"}>
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
                    <Text color={"white"} mb={4} fontSize={"sm"}>
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
                    <Text color={"white"} fontSize={"sm"}>
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
                    <Text color={"white"} mb={4} fontSize={"sm"}>
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
                    <Text color={"white"} fontSize={"sm"}>
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
        </>

    );
});

const Landing: React.FC = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null); // Reference to the scrollable container
    const [scrollPercentage, setScrollPercentage] = useState(0); // Track the scroll value
    const [calculatedOpacity, setCalculatedOpacity] = useState(1);
  
    const handleScroll = () => {
        if (scrollContainerRef.current) {
          const scrollPosition = scrollContainerRef.current.scrollTop; // Get the vertical scroll position from the Box
          const scrollHeight = scrollContainerRef.current.clientHeight; // Get the vertical scroll position from the Box
          const scrollPercentageCalc = (scrollPosition / scrollHeight);
  
          setScrollPercentage(scrollPercentageCalc); // Update state with the current scroll value
  
          if(scrollPercentageCalc> 0 && scrollPercentageCalc > 1){
              setCalculatedOpacity(2-scrollPercentageCalc);
          }
        }
      };
  
    // Add scroll event listener to the Box container
    useEffect(() => {
      console.log(calculatedOpacity);
    }, [calculatedOpacity]);
  
    // Add scroll event listener to the Box container
    useEffect(() => {
      const scrollContainer = scrollContainerRef.current;
      if (scrollContainer) {
        scrollContainer.addEventListener("scroll", handleScroll); // Add scroll listener when the container is available
  
        // Clean up event listener when the component unmounts
        return () => {
          scrollContainer.removeEventListener("scroll", handleScroll); // Remove scroll listener
        };
      }
    }, []);
  
    return (
      <>
        <Box ref={scrollContainerRef} h="100vh" overflowY="auto">
          <VStack gap={0}>
            <Section1 />
            <Section2 calcOpacity={calculatedOpacity} />
            <Box
              height={"100vh"}
              w="100%"
              bg={"red"}
              opacity={calculatedOpacity}
              // Disable pointer events when opacity is 0
            />
            <Box
                height={"100vh"}
                w="100%"
                pointerEvents={calculatedOpacity < 0.01 ? "auto" : "none"}
                opacity={1-calculatedOpacity}
            >
            <Box zIndex={-1}>
                <BaseMap />
            </Box>

            <Box 
            position={"absolute"}
            left={0}
            zIndex={10}
            >
                {/* <MainSidebar /> */}
            </Box>
            </Box>
          </VStack>
        </Box>
      </>
    );
  };
  

export default Landing;
