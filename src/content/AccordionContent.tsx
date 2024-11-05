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
    <Box className="stat-row header" style={{ margin: 0 }}>
        <Box className="title-box" style={{ margin: 0 }}>
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
    <AccordionButton className="accordion-header">
        <Box
            flex="1"
            textAlign="left"
            display="flex"
            alignItems="center"
            fontSize="16px"
        >
            {title}
            <InfoTooltip description={description} />
        </Box>
        <AccordionIcon />
    </AccordionButton>
);

export const InfoTooltip = ({ description }: any) => (
    <Tooltip label={description} fontSize="md">
        <span
            style={{
                marginLeft: "7px",
                color: "white",
                cursor: "pointer",
            }}
        >
            <FaInfoCircle fontSize="12px" />
        </span>
    </Tooltip>
);
