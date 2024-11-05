import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { ACCESSIBILITY_POINTS_COLORS, amenitiesOptions } from "../../constants";
import { mappingCategories } from "../../components/SelectAutoComplete/SelectAutoComplete";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export const AccessibilityPieChart = () => {
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
                height: "160px",
            }}
        >
            <ResponsiveContainer width={"55%"} height={"100%"}>
                <PieChart width={100} height={100}>
                    <Pie
                        data={data}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        innerRadius={30}
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
                                        fontSize: "18px",
                                        fontWeight: "600",
                                        color: "var(--primary-dark3)",
                                        paddingRight: "8px",
                                        textAlign: "right",
                                        lineHeight: "0.7",
                                    }}
                                >
                                    {entry.value || 0}
                                </td>
                                <td
                                    style={{
                                        fontSize: "14px",
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
                                    fontSize: "18px",
                                    fontWeight: "900",
                                    color: "var(--primary-dark3)",
                                    paddingRight: "8px",
                                    textAlign: "right",
                                }}
                            >
                                {accessibilityPoints.length}
                            </td>
                            <td
                                style={{
                                    fontSize: "14px",
                                    fontWeight: "900",
                                    color: "var(--primary-dark3)",
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
