import React from "react";

import "./Legend.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { getQuantiles, METRICS_MAPPING } from "../../constants";

const Legend = () => {
    const queryData = useSelector(
        (state: RootState) => state.queryData.queryData
    );
    const metric = useSelector(
        (state: RootState) => state.queryMetric.queryMetric
    );
    const [quantiles, colors] = getQuantiles(queryData, metric);

    const title = METRICS_MAPPING[metric]?.title || metric;

    const formatValue = (value: string) => {
        const type = METRICS_MAPPING[metric]?.type;
        const formattedValue = Number(value).toLocaleString("en-US");
        if (type === "percentage") {
            return `${formattedValue}%`;
        } else if (type === "minutes") {
            return `${formattedValue} min`;
        } else if (type === "area") {
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
                            .map((d: any) => formatValue(d.toFixed(0)))
                            .join(" - ")}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default Legend;
