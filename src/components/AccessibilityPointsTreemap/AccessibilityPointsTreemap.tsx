import { ACCESSIBILITY_POINTS_COLORS, amenitiesOptions } from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "@chakra-ui/react";
import { setActiveAmenity } from "../../features/viewMode/viewModeSlice";
import { Legend, ResponsiveContainer, Treemap } from "recharts";
import { mappingCategories } from "../SelectAutoComplete/SelectAutoComplete";
import { FaHospital, FaIcons, FaLocationDot, FaSchool } from "react-icons/fa6";
import { PiParkFill } from "react-icons/pi";
import { RootState } from "../../app/store";

const buildAccessibilityTree = (accessibilityPoints: any[]) => {
    return accessibilityPoints.reduce(
        (tree: Record<string, Record<string, number>>, item: any) => {
            const parentCategory =
                amenitiesOptions.find(
                    (amenityOption) => amenityOption.label === item.amenity
                )?.type || "other";
            if (!tree[parentCategory]) {
                tree[parentCategory] = {};
            }
            tree[parentCategory][item.amenity] =
                (tree[parentCategory][item.amenity] || 0) + 1;
            return tree;
        },
        {}
    );
};

const TreemapLegend = ({
    accessibilityTreeArray,
}: {
    accessibilityTreeArray: any[];
}) => {
    const items = accessibilityTreeArray.map((item) => item.name);
    const iconMap: Record<string, JSX.Element> = {
        education: <FaSchool style={{ fontSize: "min(2dvh, 1dvw)" }} />,
        health: <FaHospital style={{ fontSize: "min(2dvh, 1dvw)" }} />,
        park: <PiParkFill style={{ fontSize: "min(2dvh, 1dvw)" }} />,
        recreation: <FaIcons style={{ fontSize: "min(2dvh, 1dvw)" }} />,
        other: <FaLocationDot style={{ fontSize: "min(2dvh, 1dvw)" }} />,
    };
    return (
        <ul>
            {items.map((entry, index) => (
                <li
                    key={`item-${index}`}
                    style={{ color: ACCESSIBILITY_POINTS_COLORS[entry], fontSize: "min(2.2dvh, 1.1dvw)" }}
                >
                    {iconMap[entry]} {mappingCategories[entry]}
                </li>
            ))}
        </ul>
    );
};

const TreemapNodeContent = ({
    root,
    depth,
    x,
    y,
    width,
    height,
    name,
    size,
}: any) => {
    const activeAmenity = useSelector(
        (state: RootState) => state.viewMode.activeAmenity
    );
    const dispatch = useDispatch();
    const color = ACCESSIBILITY_POINTS_COLORS[name];
    const isActive = activeAmenity === name;

    const handleAmenityChange = (name: string) => {
        dispatch(setActiveAmenity(name));
    };
    return (
        <Tooltip
            label={`${size} ${name}`}
            aria-label="A tooltip"
            placement="top"
            hasArrow={true}
            bg={"#34353c"}
            isOpen={size && isActive && activeAmenity !== "" ? true : false}
            borderRadius="min(0.6dvh, 0.3dvw)"
            fontSize="min(2dvh, 1dvw)"
        >
            <g>
                <rect
                    x={x}
                    y={y}
                    width={depth === 2 ? width - 2 : width}
                    height={depth === 2 ? height - 2 : height}
                    style={{
                        fill: depth < 2 ? color : isActive ? color : "#ffffff",
                        stroke: "#fff",
                        strokeWidth: 2 / (depth + 1e-10),
                        strokeOpacity: 1 / (depth + 1e-10),
                        opacity: depth === 2 ? (isActive ? "0" : "0.3") : 1,
                    }}
                    onMouseOver={() => handleAmenityChange(name)}
                    onMouseOut={() => handleAmenityChange("")}
                />
                {depth === 2 && width > 30 && height > 25 ? (
                    <text
                        x={x}
                        y={y}
                        dx="min(0.5dvh, 0.25dvw)"
                        dy="min(0.5dvh, 0.25dvw)"
                        fill="#fff"
                        fontSize="min(2.2dvh, 1.1dvw)"
                        dominantBaseline="hanging"
                        fillOpacity={0.9}
                    >
                        {size}
                    </text>
                ) : null}
            </g>
        </Tooltip>
    );
};

const AccessibilityPointsTreemap = () => {
    const accessibilityPoints = useSelector(
        (state: RootState) => state.accessibilityList.accessibilityPoints
    );

    const accessibilityTreeArray = Object.entries(
        buildAccessibilityTree(accessibilityPoints)
    ).map(([key, value]) => ({
        name: key,
        children: Object.entries(value).map(([amenity, count]) => ({
            name: amenity,
            size: count,
        })),
    }));

    return (
        <>
            <div style={{ height: 'min(30dvh, 15dvw)' }}>
            <ResponsiveContainer width={"100%"} height={"100%"}>
                <Treemap
                    data={accessibilityTreeArray}
                    dataKey={"size"}
                    animationDuration={100}
                    content={<TreemapNodeContent />}
                />
            </ResponsiveContainer>
            </div>
            <Legend
                content={() => (
                    <TreemapLegend
                        accessibilityTreeArray={accessibilityTreeArray}
                    />
                )}
            />
        </>
    );
};

export default AccessibilityPointsTreemap;
