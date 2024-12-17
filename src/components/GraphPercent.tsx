import { CircularProgress, CircularProgressLabel } from "@chakra-ui/react";
import { IoCaretDown, IoCaretUp } from "react-icons/io5";

export const GraphPercent = ({ value }: { value: number }) => {
    return (
        <CircularProgress
            size="100px"
            value={value}
            color="var(--primary-dark)"
        >
            <CircularProgressLabel
                fontSize="18px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
            >
                {(value || 0).toFixed(0)}%
            </CircularProgressLabel>
        </CircularProgress>
    );
};

export const GraphPercentWIndicator = ({
    value,
    compareWith,
}: {
    value: number;
    compareWith: number;
}) => {
    const isHigher = value > compareWith;
    const ArrowIcon = isHigher ? IoCaretUp : IoCaretDown;
    const indicatorColor = isHigher ? "green" : "red";

    return (
        <CircularProgress
            size="100px"
            value={value}
            color="var(--primary-dark)"
        >
            <CircularProgressLabel
                fontSize="18px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
            >
                {(value || 0).toFixed(0)}%{" "}
                {compareWith !== undefined && (
                    <ArrowIcon
                        style={{ marginLeft: "4px", color: indicatorColor }}
                    />
                )}
            </CircularProgressLabel>
        </CircularProgress>
    );
};

export const Caret = ({
    value,
    compareWith,
}: {
    value?: number;
    compareWith?: number;
}) => {
    if (value === undefined || compareWith === undefined) return null;
    const isHigher = value > compareWith;
    return isHigher ? (
        <IoCaretUp style={{ marginLeft: "4px", color: "green" }} />
    ) : (
        <IoCaretDown style={{ marginLeft: "4px", color: "red" }} />
    );
};
