import React, { useRef, useState, useEffect, forwardRef } from "react";
import {
    Box,
    Text,
    Heading,
    VStack,
    SimpleGrid,
    Center,
    Button,
    position,
    IconButton,
    Icon,
    Tooltip,
} from "@chakra-ui/react";
import { MainSidebar, BaseMap } from "../";
import Toolbar from "../Toolbar";
import introJs from "intro.js";
import "intro.js/introjs.css";

import "./Landing.scss";
import { MdInfoOutline } from "react-icons/md";
import { setProject } from "../../features/viewMode/viewModeSlice";
import { useDispatch } from "react-redux";

const Section1 = forwardRef<HTMLDivElement>((props, ref) => {
    return (
        <Box
            ref={ref}
            h="100vh"
            w="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            className="landing__header"
        >
            <Center w="100%" color="white">
                <Heading
                    as="h1"
                    fontSize={"8vw"}
                    noOfLines={2}
                    textAlign={"center"}
                >
                    r e I M A G I N A<br></br>U R B A N O
                </Heading>
            </Center>
        </Box>
    );
});

const Section2 = forwardRef<HTMLDivElement, { calcOpacity: number }>(
    (props, ref) => {
        const { calcOpacity } = props;
        return (
            <>
                <Box
                    ref={ref}
                    opacity={calcOpacity}
                    h="200vh"
                    w="100%"
                    zIndex={1}
                    className="landing__subheader"
                >
                    <SimpleGrid
                        columns={[1, 3]}
                        position={"sticky"}
                        top={0}
                        pointerEvents={calcOpacity < 0.01 ? "none" : "auto"}
                    >
                        <Box px={10}>
                            <Heading fontSize={"3vw"} color={"white"}>
                                Visor
                            </Heading>
                            <Heading fontSize={"1.5vw"} color={"white"} mb={12}>
                                Mapeando la realidad
                            </Heading>
                            <Text color={"white"} mb={4} fontSize={"sm"}>
                                Visor es una herramienta clave para comprender
                                la realidad demográfica, social y económica de
                                las áreas seleccionadas. A través del análisis
                                detallado de perfiles sociodemográficos, como la
                                población total, la pirámide poblacional y el
                                nivel educativo, así como de perfiles
                                socioeconómicos que incluyen la disponibilidad
                                de servicios de salud, bienestar y el índice de
                                bienestar económico, los usuarios pueden obtener
                                una visión completa del contexto de la zona en
                                estudio.
                            </Text>
                            <Text color={"white"} fontSize={"sm"}>
                                Este conocimiento es fundamental para la
                                correcta planificación y ejecución de políticas
                                públicas, proyectos de infraestructura y
                                desarrollo social. Al entender la composición y
                                las necesidades específicas de la población, se
                                pueden diseñar intervenciones más efectivas que
                                respondan a las realidades locales.
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
                                Una vez comprendido el perfil de la zona, es
                                crucial evaluar las características físicas y la
                                accesibilidad a los servicios urbanos
                                disponibles. La accesibilidad se refiere no solo
                                a la proximidad de servicios y equipamientos,
                                sino también a factores como el radio de
                                cobertura, el tiempo de traslado, y las posibles
                                barreras físicas como desniveles del terreno.
                            </Text>
                            <Text color={"white"} fontSize={"sm"}>
                                Estos elementos son determinantes para entender
                                las limitaciones urbanas y sociales que podrían
                                afectar la movilidad y el acceso equitativo a
                                recursos esenciales. Además, analizar la
                                utilización de los equipamientos existentes y
                                los tipos de servicios disponibles permite
                                identificar áreas donde la oferta podría estar
                                desajustada a la demanda, lo que es vital para
                                la planificación de mejoras en la
                                infraestructura urbana y la calidad de vida de
                                los habitantes.
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
                                El análisis del potencial urbano se centra en
                                maximizar el uso eficiente del suelo y el
                                desarrollo sostenible de las áreas urbanas. Este
                                apartado evalúa las densidades poblacionales,
                                las alturas máximas permitidas y compara la
                                situación actual con el potencial de desarrollo
                                de la zona. También se enfoca en la
                                identificación de áreas subutilizadas que
                                podrían ser optimizadas para satisfacer las
                                necesidades urbanas en crecimiento.
                            </Text>
                            <Text color={"white"} fontSize={"sm"}>
                                Al explorar el porcentaje de subutilización y
                                los tipos de espacios subutilizados, los
                                planificadores urbanos pueden detectar
                                oportunidades para desarrollar nuevos proyectos
                                residenciales, comerciales o de infraestructura
                                que mejoren la funcionalidad y estética de la
                                ciudad. Este enfoque promueve un crecimiento
                                urbano equilibrado y sostenible, que no solo
                                responde a las necesidades actuales, sino que
                                también se anticipa a las futuras demandas de la
                                comunidad.
                            </Text>
                        </Box>
                    </SimpleGrid>
                </Box>
            </>
        );
    }
);

const Landing: React.FC = () => {
    const dispatch = useDispatch();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [calculatedOpacity, setCalculatedOpacity] = useState(1);
    const [activateLanding, setActivateLanding] = useState(true);

    const handleScroll = () => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            const scrollPosition = scrollContainer.scrollTop;
            const scrollHeight = scrollContainer.clientHeight;
            const scrollPercentageCalc = scrollPosition / scrollHeight;

            if (scrollPercentageCalc > 0 && scrollPercentageCalc > 1) {
                const opacity = 2 - scrollPercentageCalc;
                setCalculatedOpacity(opacity > 0.95 ? 1 : opacity);
            } else {
                setCalculatedOpacity(1);
            }
        }
    };

    const handleActivateLanding = () => {
        setCalculatedOpacity(0.1);
        setActivateLanding(true);
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top:
                    scrollContainerRef.current.scrollTop -
                    scrollContainerRef.current.clientHeight,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        const hash = window.location.hash;
        if (hash === "#culiacan_sur" || hash === "#culiacan_centro") {
            setCalculatedOpacity(0);
            setActivateLanding(false);
        }
    }, []);

    useEffect(() => {
        if (calculatedOpacity <= 0) {
            dispatch(setProject("culiacan_sur"));
            setActivateLanding(false);
        }
    }, [calculatedOpacity]);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", handleScroll);
        }
    }, []);

    useEffect(() => {
        // Function to scroll to the element based on the hash
        const scrollToHashElement = () => {
            const hash = window.location.hash;
            if (hash) {
                const element = document.querySelector(hash);
                if (element) {
                    element.scrollIntoView({ behavior: "instant" });
                }
            }
        };

        scrollToHashElement();

        window.addEventListener("hashchange", scrollToHashElement);

        return () => {
            window.removeEventListener("hashchange", scrollToHashElement);
        };
    }, []);

    const showHelp = () => {
        const intro = introJs();
        intro.setOptions({
            steps: [
                {
                    intro: "Bienvenido al mapa interactivo de ReImagina Urbano",
                },
                {
                    element: "#map-container",
                    intro: "Para navegar puedes arrastrar el mapa",
                },
                {
                    element: ".toolbar-help",
                    intro: "Puedes cambiar la inclinación del mapa usando Ctrl y arrastrando el mapa al mismo tiempo",
                },
                {
                    element: ".toolbar-zoom",
                    intro: "Puedes hacer zoom dando click aquí o girando la rueda de tu mouse",
                },
                {
                    element: ".mainSidebar",
                    intro: "En esta sección verás metricas relacionadas al área del mapa.",
                },
            ],
            showProgress: true,
            showBullets: true,
        });
        intro.start();
    };

    return (
        <>
            <Box ref={scrollContainerRef} h="100vh" overflowY="scroll">
                <VStack gap={0}>
                    <Section1 />
                    <Section2 calcOpacity={calculatedOpacity} />

                    <Box zIndex={activateLanding ? -2 : 1} id="map">
                        <BaseMap />
                    </Box>

                    {calculatedOpacity <= 0.1 && (
                        <Box
                            zIndex={activateLanding ? -1 : 1}
                            position={"absolute"}
                            left={0}
                            height={"100vh"}
                            width={"auto"}
                            display={"flex"}
                            justifyContent={"space-between"}
                            id="map"
                        >
                            <Tooltip hasArrow label="Tutorial" fontSize="14px">
                                <IconButton
                                    bg="gray.600"
                                    color="white"
                                    className="button-small"
                                    size="xs"
                                    aria-label="Info"
                                    style={{
                                        position: "fixed",
                                        top: "0px",
                                        left: "375px",
                                    }}
                                    onClick={() => {
                                        showHelp();
                                    }}
                                >
                                    <MdInfoOutline />
                                </IconButton>
                            </Tooltip>
                            <MainSidebar />
                            <Toolbar
                                handleActivateLanding={handleActivateLanding}
                            />
                        </Box>
                    )}
                </VStack>
            </Box>
        </>
    );
};

export default Landing;
