import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { ACCESSIBILITY_POINTS_COLORS, amenitiesOptions } from "../../constants";
import { mappingCategories } from "../../components/SelectAutoComplete/SelectAutoComplete";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

export const AccessibilityPieChart = () => {
    const multiplierHeight = 0.2;
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

    const accessibilityPoints = useSelector(
        (state: RootState) => state.accessibilityList.accessibilityPoints
    );
    const accessibilityList = useSelector(
        (state: RootState) => state.accessibilityList.accessibilityList
    );
    const categoryCount = accessibilityPoints.reduce((acc: any, item: any) => {
        const categoryType =
            amenitiesOptions.find((option) => option.label === item.amenity)
                ?.type || "other";

        acc[categoryType] = acc[categoryType] || 0;
        acc[categoryType]++;
        return acc;
    }, {});
    const categoryTypesIncluded = Array.from(
        new Set(accessibilityList.map((item: any) => item.type))
    );
    const data = Object.entries(mappingCategories)
        .filter(([key, value]: any) => {
            return (
                categoryTypesIncluded.length === 0 ||
                categoryTypesIncluded.includes(key)
            );
        })
        .map(([key, value]) => ({
            name: key,
            value: categoryCount[key] || 0,
        }))
        .sort((a, b) => b.value - a.value);

    return (
        <div
            style={{
                display: "flex",
                width: "100%",
            }}
        >
            <ResponsiveContainer width={"55%"} height={chartSize.height}>
                <PieChart width={chartSize.height} height={chartSize.height}>
                    <Pie
                        data={data}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius={chartSize.width * 0.45}
                        innerRadius={chartSize.width * 0.2}
                        fill="#8884d8"
                        stroke="none"
                    >
                        {data.map((entry: any, index: any) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={ACCESSIBILITY_POINTS_COLORS[entry.name]}
                            />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div style={{ width: "45%", alignContent: "center" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                        {data.map((entry: any, index: any) => (
                            <tr key={index}>
                                <td
                                    style={{
                                        fontSize: "min(2.4dvh, 1.2dvw)",
                                        fontWeight: "600",
                                        color: "var(--primary-dark3)",
                                        textAlign: "right",
                                        padding: "0 min(2dvh, 1dvw) 0 0",
                                        lineHeight: "min(3dvh, 1.5dvw)",
                                    }}
                                >
                                    {entry.value || 0}
                                </td>
                                <td
                                    style={{
                                        fontSize: "min(2dvh, 1dvw)",
                                        padding: "0 min(2dvh, 1dvw) 0 0",
                                        fontWeight: "700",
                                        color: ACCESSIBILITY_POINTS_COLORS[
                                            entry.name
                                        ],
                                    }}
                                >
                                    {mappingCategories[entry.name] ||
                                        entry.name}
                                </td>
                            </tr>
                        ))}
                        <tr key="total">
                            <td
                                style={{
                                    fontSize: "min(2.4dvh, 1.2dvw)",
                                    fontWeight: "900",
                                    color: "var(--primary-dark3)",
                                    textAlign: "right",
                                    padding: "0 min(2dvh, 1dvw) 0 0",
                                    lineHeight: "min(3dvh, 1.5dvw)",
                                }}
                            >
                                {accessibilityPoints.length}
                            </td>
                            <td
                                style={{
                                    fontSize: "min(2dvh, 1dvw)",
                                    fontWeight: "900",
                                    color: "var(--primary-dark3)",
                                    padding: "0 min(2dvh, 1dvw) 0 0",
                                    lineHeight: "min(3dvh, 1.5dvw)",
                                }}
                            >
                                Total
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
