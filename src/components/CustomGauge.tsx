import { useEffect, useMemo, useState } from "react";
import { Pie, PieChart, ResponsiveContainer } from "recharts";
import { formatNumber } from "../constants";
import { Tooltip } from "@chakra-ui/react";

interface CustomGaugeProps {
    value: number;
    globalValue?: number; // Now optional
    description?: string;
    percentage?: boolean;
}

export const CustomGauge = ({
    value,
    globalValue,
    description,
    percentage = true,
}: CustomGaugeProps) => {
    const multiplierHeight = 0.18;
    const multiplierWidth = 0.2;
    const [chartSize, setChartSize] = useState({
        width:
            Math.min(window.innerHeight, window.innerWidth / 2) *
            multiplierWidth,
        height:
            Math.min(window.innerHeight, window.innerWidth / 2) *
            multiplierHeight,
    });

    useEffect(() => {
        const updateSize = () => {
            setChartSize({
                width:
                    Math.min(window.innerHeight, window.innerWidth / 2) *
                    multiplierWidth,
                height:
                    Math.min(window.innerHeight, window.innerWidth / 2) *
                    multiplierHeight,
            });
        };

        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    const isComparisonEnabled = globalValue !== undefined;
    const isHigher = isComparisonEnabled && value > globalValue;
    const color = isComparisonEnabled
        ? isHigher
            ? "green"
            : "red"
        : "var(--primary-dark)";
    const colorLight = isComparisonEnabled
        ? isHigher
            ? "lightgreen"
            : "lightcoral"
        : "var(--primary-dark)";

    // Scale radii dynamically based on chart size
    const innerRadius = chartSize.width * 0.2 * 1.3;
    const outerRadius = chartSize.width * 0.26 * 1.3;

    const data = [
        { name: `${value}%`, value: value, fill: "var(--primary-dark)" },
        { name: "Remaining", value: 100 - value, fill: "#edebe9" },
    ];

    const highlightData = isComparisonEnabled
        ? [
              {
                  name: "Remaining",
                  value: Math.min(value, globalValue),
                  fill: "transparent",
              },
              {
                  name: "Highlight",
                  value: Math.abs(value - globalValue),
                  fill: colorLight,
              },
              {
                  name: "Remaining 2",
                  value: 100 - Math.max(value, globalValue),
                  fill: "transparent",
              },
          ]
        : [];

    const chartData = useMemo(() => data.slice(), [value, globalValue]);
    const chartHighlightData = useMemo(
        () => (isComparisonEnabled ? highlightData.slice() : []),
        [value, globalValue]
    );

    const RADIAN = Math.PI / 180;
    const startAngle = isComparisonEnabled
        ? 450 - (Math.max(value, globalValue) / 100) * 360
        : 90;
    const endAngle = isComparisonEnabled
        ? 450 - (Math.min(value, globalValue) / 100) * 360
        : -270;
    const midAngle = (startAngle + endAngle) / 2;

    const midSin = Math.sin(-RADIAN * midAngle);
    const midCos = Math.cos(-RADIAN * midAngle);
    const startSin = Math.sin(-RADIAN * endAngle);
    const startCos = Math.cos(-RADIAN * endAngle);

    const textAnchor = midCos >= 0 ? "start" : "end";
    const sign = isHigher ? "+" : "-";

    // Dynamically scale label & path positions
    const labelOffset = chartSize.width * 0.07;
    const sx = (outerRadius + labelOffset) * startCos;
    const sy = (outerRadius + labelOffset) * startSin;
    const startMx = innerRadius * startCos;
    const startMy = innerRadius * startSin;
    const ex = (outerRadius + labelOffset) * midCos;
    const ey = (outerRadius + labelOffset) * midSin;

    if (value === undefined) return null;

    const Content = (
        <div
            style={{
                width: chartSize.width,
                height: chartSize.height,
                overflow: "hidden",
            }}
        >
            <ResponsiveContainer width="100%" height="100%">
                <PieChart width={chartSize.width} height={chartSize.height}>
                    {/* Main Gauge */}
                    <Pie
                        data={chartData}
                        startAngle={90}
                        endAngle={-270}
                        innerRadius={innerRadius}
                        outerRadius={outerRadius}
                        paddingAngle={0}
                        dataKey="value"
                        stroke="none"
                        animationDuration={500}
                        isAnimationActive={true}
                    />

                    {/* Highlight Gauge (only if globalValue is provided) */}
                    {isComparisonEnabled && (
                        <Pie
                            data={chartHighlightData}
                            startAngle={90}
                            endAngle={-270}
                            innerRadius={outerRadius}
                            outerRadius={outerRadius + chartSize.width * 0.04}
                            dataKey="value"
                            stroke="none"
                            animationDuration={500}
                            isAnimationActive={true}
                        />
                    )}

                    {/* Labels & Path */}
                    <g
                        transform={`translate(${chartSize.width / 2}, ${
                            chartSize.height / 2
                        })`}
                    >
                        {/* Main Value Label */}
                        <text
                            x="0"
                            y="0"
                            dy={chartSize.width * 0.03}
                            textAnchor="middle"
                            fill={color}
                            fontSize={chartSize.width * 0.13} // Responsive font size
                        >
                            {formatNumber(value)}
                            {percentage ? "%" : ""}
                        </text>

                        {/* Difference Label and Path (only if globalValue is provided) */}
                        {isComparisonEnabled &&
                            Math.abs(value - globalValue) >= 1 && (
                                <>
                                    <text
                                        x={ex}
                                        y={ey}
                                        dx={chartSize.width * -0.01}
                                        dy={chartSize.width * 0.02}
                                        textAnchor={textAnchor}
                                        dominantBaseline="middle" // Centers text properly
                                        fill={color}
                                        fontSize={chartSize.width * 0.06} // Responsive font size
                                    >
                                        {sign}
                                        {formatNumber(
                                            Math.abs(value - globalValue)
                                        )}
                                    </text>
                                    <path
                                        d={`M${sx},${sy}L${startMx},${startMy}`}
                                        stroke={colorLight}
                                        fill="none"
                                        strokeWidth={chartSize.width * 0.02} // Responsive stroke width
                                    />
                                </>
                            )}
                    </g>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );

    return description ? (
        <Tooltip
            hasArrow
            placement="right"
            label={description}
            borderRadius="min(0.6dvh, 0.3dvw)"
            fontSize="min(2dvh, 1dvw)"
        >
            {Content}
        </Tooltip>
    ) : (
        Content
    );
};
