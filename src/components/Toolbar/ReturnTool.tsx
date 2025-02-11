import { IconButton, Tooltip } from "@chakra-ui/react";
import { MdArrowBack } from "react-icons/md";

interface ReturnToolProps {
    handleActivateLanding: () => void;
}

export const ReturnTool = ({ handleActivateLanding }: ReturnToolProps) => (
    <Tooltip
        hasArrow
        label="Regresar a Inicio"
        borderRadius="min(0.6dvh, 0.3dvw)"
        fontSize="min(2dvh, 1dvw)"
    >
        <IconButton
            aria-label="Regresar a Inicio"
            className="button-small"
            size="xs"
            onClick={() => handleActivateLanding()}
        >
            <MdArrowBack fontSize="1dvw" />
        </IconButton>
    </Tooltip>
);
