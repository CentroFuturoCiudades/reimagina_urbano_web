import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { METRIC_DESCRIPTIONS, METRICS_MAPPING } from "../constants";
import { setQueryMetric } from "../features/queryMetric/queryMetricSlice";
import { Box, Icon, Text, Tooltip } from "@chakra-ui/react";

export const ComparativeMetric = ({
    name,
    metric,
    icon,
    disabled,
    children,
}: {
    name?: string;
    metric?: string;
    icon?: any;
    disabled?: boolean;
    children: React.ReactNode[] | React.ReactNode;
}) => {
    const dispatch = useDispatch();
    const currentMetric = useSelector(
        (state: RootState) => state.queryMetric.queryMetric
    );
    const isCurrent = currentMetric === metric;
    const title = metric
        ? name || METRICS_MAPPING[metric]?.title || metric
        : name || "";

    return (
        <Box
            className="stat-row"
            style={{
                cursor: metric && !disabled ? "pointer" : "default",
            }}
            onClick={() => {
                if (metric && !disabled) dispatch(setQueryMetric(metric));
            }}
        >
            <Box
                className={`stat-title-box${
                    metric && !disabled ? " regular" : ""
                }${isCurrent ? " active" : ""}`}
            >
                <Tooltip
                    hasArrow
                    label={METRIC_DESCRIPTIONS[metric || ""]}
                    fontSize="md"
                    placement="right"
                >
                    <Text
                        className="stat-title"
                        style={{ color: isCurrent ? "white" : "#383b46" }}
                    >
                        {icon && (
                            <span>
                                <Icon
                                    as={icon}
                                    mr="2"
                                    color={isCurrent ? "white" : "#383b46"}
                                />
                            </span>
                        )}
                        {title}
                    </Text>
                </Tooltip>
            </Box>
            {Array.isArray(children) ? (
                <Box className="stat-value">
                    <Box>{children[0]}</Box>
                    {children.length > 1 && (
                        <Box className="dark">{children[1]}</Box>
                    )}
                </Box>
            ) : (
                <Box className="stat-value full">
                    <Box>{children}</Box>
                </Box>
            )}
        </Box>
    );
};
