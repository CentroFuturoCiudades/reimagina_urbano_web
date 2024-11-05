import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import "./PopulationPyramid.scss";

interface PopulationPyramidProps {
    data: { age: string; male: number; female: number; total: number }[];
    invertAxes?: boolean;
    showLegend?: boolean;
    additionalMarginBottom?: number;
}

const renderCustomLegend = () => (
    <div
        style={{
            display: "flex",
            justifyContent: "flex-start",
            paddingLeft: "0px",
            marginLeft: "-25px",
        }}
    >
        <div
            style={{
                display: "flex",
                alignItems: "center",
                marginRight: "15px",
            }}
        >
            <span
                style={{
                    width: "12px",
                    height: "12px",
                    backgroundColor: "#ff7f7f",
                    display: "inline-block",
                    marginRight: "5px",
                }}
            ></span>
            <span>Mujeres</span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
            <span
                style={{
                    width: "12px",
                    height: "12px",
                    backgroundColor: "#8884d8",
                    display: "inline-block",
                    marginRight: "5px",
                }}
            ></span>
            <span>Hombres</span>
        </div>
    </div>
);

const PopulationPyramid: React.FC<PopulationPyramidProps> = ({
    data,
    invertAxes = false,
    showLegend = false,
    additionalMarginBottom = 0,
}) => {
    const renderTooltip = (props: any) => {
        if (props.payload && props.payload.length) {
            const { payload } = props.payload[0];

            // Función para aplicar comas a los números
            const formatNumber = (number: number) =>
                number?.toLocaleString("es-MX", { maximumFractionDigits: 0 });

            return (
                <div
                    className="custom-tooltip"
                    style={{ fontSize: "0.85em", padding: "5px" }}
                >
                    <p style={{ fontWeight: "bold", fontSize: "1em" }}>
                        {`Edades de ${payload.age}`}
                    </p>
                    <p style={{ fontWeight: "500" }}>
                        <b>Total: </b>
                        {`${formatNumber(payload.per_total)}% (${formatNumber(
                            payload.total
                        )})`}
                    </p>
                    <p style={{ color: "#8884d8", fontWeight: "500" }}>
                        <b>Hombres: </b>
                        {`${formatNumber(payload.per_male)}% (${formatNumber(
                            payload.male
                        )})`}
                    </p>
                    <p style={{ color: "#ff7f7f", fontWeight: "500" }}>
                        <b>Mujeres: </b>
                        {`${formatNumber(payload.per_female)}% (${formatNumber(
                            payload.female
                        )})`}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer
            className={"pyramidContainer"}
            width={"100%"}
            height={400}
        >
            <BarChart
                layout="vertical"
                data={data}
                margin={{
                    top: 20,
                    right: invertAxes ? 0 : 30,
                    left: invertAxes ? 30 : 0,
                    bottom: additionalMarginBottom || 5,
                }}
            >
                <XAxis
                    type="number"
                    domain={[0, 30]}
                    tickFormatter={(tick) =>
                        Math.abs(tick.toFixed(0)).toString()
                    }
                    ticks={Array.from({ length: 5 }, (_, i) => i * 10)}
                    reversed={invertAxes}
                />

                <YAxis
                    type="category"
                    dataKey="age"
                    orientation={invertAxes ? "right" : "left"}
                    tick={{ dx: invertAxes ? -150 : 148, fontSize: "0.8em" }}
                    width={invertAxes ? 10 : 10}
                />

                <Tooltip content={renderTooltip} />

                {showLegend && (
                    <Legend
                        verticalAlign="bottom"
                        align="left"
                        wrapperStyle={{ paddingLeft: "0px" }}
                        content={renderCustomLegend}
                    />
                )}

                <Bar dataKey="per_male" fill="#8884d8" name="Hombres" />
                <Bar dataKey="per_female" fill="#ff7f7f" name="Mujeres" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default PopulationPyramid;
