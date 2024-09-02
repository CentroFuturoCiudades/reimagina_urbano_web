import React from "react";
import * as d3 from "d3";

import "./Legend.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { COLUMN_MAPPING, VIEW_COLORS_RGBA } from "../../constants";

const Legend = () => {
    const queryData = useSelector(
        (state: RootState) => state.queryData.queryData
    );
    const metric = useSelector(
        (state: RootState) => state.queryMetric.queryMetric
    );

    const domain = [
        Math.min(...(Object.values(queryData) as any)),
        Math.max(...(Object.values(queryData) as any)),
    ];

    const colors = d3.quantize(
        d3.interpolateRgb(
            VIEW_COLORS_RGBA.ACCESIBILIDAD.light,
            VIEW_COLORS_RGBA.ACCESIBILIDAD.dark
        ),
        8
    );

    const quantiles = d3.scaleQuantize<string>().domain(domain).range(colors);

    const title = COLUMN_MAPPING[metric] || metric;

    const formatValue = (value: string) => {
        const formattedValue = Number(value).toLocaleString("en-US");
        if (
            title.toLowerCase().includes("porcentaje") ||
            title.toLowerCase().includes("ratio")
        ) {
            return `${formattedValue}%`;
        } else if (
            title.toLowerCase().includes("minutos") ||
            title.toLowerCase().includes("minutes")
        ) {
            return `${formattedValue} min`;
        } else if (
            title.toLowerCase().includes("área") ||
            title.toLowerCase().includes("area")
        ) {
            return `${formattedValue} m²`;
        }
        return formattedValue;
    };

    if (!Object.keys(queryData).length) {
        return <></>;
    }

    return (
        <div className="legend">
            <h4 className="legend__title">
                <b>{title}</b>
            </h4>
            {colors.map((color, i) => (
                <div key={i} className="legend__label">
                    <div
                        className="legend__icon"
                        style={{ background: color }}
                    />
                    <span>
                        {quantiles
                            .invertExtent(color)
                            .map((d) => formatValue(d.toFixed(0)))
                            .join(" - ")}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default Legend;
