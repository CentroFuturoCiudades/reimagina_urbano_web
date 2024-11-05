import { useMemo } from "react";
import { Pie, PieChart, ResponsiveContainer } from "recharts";
import { formatNumber } from "../constants";
import { Tooltip } from "@chakra-ui/react";

export const CustomGauge = ({
    value,
    globalValue,
    description,
}: {
    value: number;
    globalValue: number;
    description?: string;
}) => {
    const isHigher = value > globalValue;
    const data = [
        {
            name: `${value}%`,
            value: value,
            fill: "var(--primary-dark)",
        },
        {
            name: "Remaining",
            value: 100 - value,
            fill: "#edebe9",
        },
    ];

    const chartData = useMemo(() => data.slice(), [value, globalValue]);

    const RADIAN = Math.PI / 180;
    const innerRadius = 36;
    const outerRadius = 48;

    // Calculating angles based on `value` and `globalValue`
    const startPercentage = Math.min(value, globalValue);
    const endPercentage = Math.max(value, globalValue);
    const startAngle = isHigher
        ? 450 - (endPercentage / 100) * 360
        : 450 - (startPercentage / 100) * 360;
    const endAngle = isHigher
        ? 450 - (startPercentage / 100) * 360
        : 450 - (endPercentage / 100) * 360;

    const midAngle = (startAngle + endAngle) / 2;

    const midSin = Math.sin(-RADIAN * midAngle);
    const midCos = Math.cos(-RADIAN * midAngle);
    const startSin = Math.sin(-RADIAN * endAngle);
    const startCos = Math.cos(-RADIAN * endAngle);

    const color = isHigher ? "green" : "red";
    const colorLight = isHigher ? "lightgreen" : "lightcoral";

    const sx = (outerRadius + 8) * startCos;
    const sy = (outerRadius + 8) * startSin;
    const startMx = innerRadius * startCos;
    const startMy = innerRadius * startSin;
    const ex = (outerRadius + 10) * midCos;
    const ey = (outerRadius + 10) * midSin;
    const textAnchor = midCos >= 0 ? "start" : "end";
    const sign = isHigher ? "+" : "-";

    const highlightData = [
        {
            name: "Remaining",
            value: startPercentage,
            fill: "transparent",
        },
        {
            name: "Highlight",
            value: endPercentage - startPercentage,
            fill: colorLight,
        },
        {
            name: "Remaining 2",
            value: 100 - endPercentage,
            fill: "transparent",
        },
    ];

    const chartHighlightData = useMemo(
        () => highlightData.slice(),
        [value, globalValue]
    );

    if (value === undefined || globalValue === undefined) {
        return <></>;
    }

    const Content = (
        <div style={{ width: "200px", height: "130px", overflow: "hidden" }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart width={200} height={130}>
                    {/* Main Gauge */}
                    <Pie
                        startAngle={90}
                        endAngle={-270}
                        data={chartData}
                        innerRadius={36}
                        outerRadius={48}
                        paddingAngle={0}
                        fill="#8884d8"
                        dataKey="value"
                        stroke="none"
                        animationDuration={500}
                        isAnimationActive={true}
                    />

                    {/* Highlight Gauge */}
                    <Pie
                        data={chartHighlightData}
                        startAngle={90}
                        endAngle={-270}
                        innerRadius={outerRadius}
                        outerRadius={outerRadius + 4}
                        dataKey="value"
                        stroke="none"
                        animationDuration={500}
                        isAnimationActive={true}
                    />

                    {/* Labels and Path */}
                    <g transform={`translate(80, 65)`}>
                        <text
                            x="0"
                            y="0"
                            dy={8}
                            textAnchor="middle"
                            fill={isHigher ? "green" : "red"}
                        >
                            {formatNumber(value)}%
                        </text>
                        <text
                            x={ex}
                            y={ey}
                            textAnchor={textAnchor}
                            fill={color}
                            fontSize="8px"
                        >
                            {sign}
                            {formatNumber(Math.abs(value - globalValue))}%
                        </text>
                        <path
                            d={`M${sx},${sy}L${startMx},${startMy}`}
                            stroke={colorLight}
                            fill="none"
                            strokeWidth={3}
                        />
                    </g>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );

    return description ? (
        <Tooltip hasArrow placement="right" label={description}>
            {Content}
        </Tooltip>
    ) : (
        Content
    );
};
