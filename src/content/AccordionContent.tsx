import {
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Text,
    Tooltip,
} from "@chakra-ui/react";
import { FaInfoCircle } from "react-icons/fa";

export const ComparativeTitles = ({ title, titleCompare }: any) => (
    <Box className="stat-row header">
        <Box className="title-box">
            <Text className="stat-title" width={"50%"}>
                {title}
            </Text>
            <Text className="stat-title dark" width={"50%"}>
                {titleCompare}
            </Text>
        </Box>
    </Box>
);

export const AccordionContent = ({ title, description, children }: any) => (
    <AccordionItem style={{ borderWidth: "0px" }}>
        <AccordionHeader title={title} description={description} />
        <AccordionPanel p={0}>{children}</AccordionPanel>
    </AccordionItem>
);

export const AccordionHeader = ({ title, description }: any) => (
    <AccordionButton
        className="accordion-header"
        height="min(5dvh, 2.5dvw)"
        style={{
            padding: "0 min(2dvh, 1dvw) 0 min(2dvh, 1dvw)",
        }}
    >
        <Box
            flex="1"
            textAlign="left"
            display="flex"
            alignItems="center"
            borderRadius="min(0.6dvh, 0.3dvw)"
            fontSize="min(2dvh, 1dvw)"
        >
            {title}
            <InfoTooltip description={description} />
        </Box>
        <AccordionIcon fontSize="min(2.5dvh, 1.5dvw)" />
    </AccordionButton>
);

export const InfoTooltip = ({ description }: any) => (
    <Tooltip
        hasArrow
        label={description}
        borderRadius="min(0.6dvh, 0.3dvw)"
        fontSize="min(2dvh, 1dvw)"
    >
        <span
            style={{
                marginLeft: "7px",
                color: "white",
                cursor: "pointer",
            }}
        >
            <FaInfoCircle fontSize="min(1.5dvh, 1.2dvw)" />
        </span>
    </Tooltip>
);
