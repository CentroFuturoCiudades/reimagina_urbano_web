import { IconButton, Tooltip } from "@chakra-ui/react";
import introJs from "intro.js";
import { MdInfoOutline } from "react-icons/md";

export const TutorialTool = () => {
    const showHelp = () => {
        const intro = introJs();
        intro.setOptions({
            steps: [
                {
                    intro: "Bienvenido al mapa interactivo de ReImagina Urbano",
                },
                {
                    element: ".mainSidebar",
                    intro: "En esta sección verás metricas relacionadas al área del mapa.",
                },
                {
                    element: "#map",
                    intro: "Para navegar puedes arrastrar el mapa con el mouse.",
                },
                {
                    element: ".toolbar-zoom",
                    intro: "Puedes hacer zoom dando click aquí o girando la rueda de tu mouse",
                },
                {
                    element: ".toolbar-instruction-controls",
                    intro: "Puedes cambiar la inclinación del mapa usando Ctrl y arrastrando el mapa al mismo tiempo",
                },
            ],
            showProgress: true,
            showBullets: true,
        });
        intro.start();
    };

    return (
        <Tooltip
            id="toolbar-tutorial"
            hasArrow
            label="Tutorial"
            borderRadius="min(0.6dvh, 0.3dvw)"
            fontSize="min(2dvh, 1dvw)"
        >
            <IconButton
                bg="gray.600"
                color="white"
                className="button-small"
                size="xs"
                aria-label="Info"
                onClick={() => {
                    showHelp();
                }}
            >
                <MdInfoOutline fontSize="1dvw" />
            </IconButton>
        </Tooltip>
    );
};
