import { IconButton, Tooltip } from "@chakra-ui/react";
import { MdArrowBack } from "react-icons/md";

interface ReturnToolProps {
    handleActivateLanding: () => void;
}

export const ReturnTool = ({ handleActivateLanding }: ReturnToolProps) => (
    <Tooltip m="2" hasArrow label="Regresar a Inicio" fontSize="14px">
        <IconButton
            aria-label="Regresar a Inicio"
            className="button-small"
            style={{ position: "absolute", top: "0px", left: "340px" }}
            size="xs"
            onClick={() => handleActivateLanding()}
        >
            <MdArrowBack />
        </IconButton>
    </Tooltip>
);
