import { useEffect, useState } from "react";

import "./Legend.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { getQuantiles, METRICS_MAPPING } from "../../constants";
import { setLegendLimits } from "../../features/viewMode/viewModeSlice";

const Legend = () => {
    const dispatch: AppDispatch = useDispatch();

    const queryData = useSelector(
        (state: RootState) => state.queryData.queryData
    );
    const metric = useSelector(
        (state: RootState) => state.queryMetric.queryMetric
    );
    const [quantiles, colors] = getQuantiles(queryData, metric);
    const [active, setActive] = useState(-1);

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

    useEffect(() => {
        setActive(-1);
        dispatch(setLegendLimits(null));
    }, [metric, dispatch]);

    if (!Object.keys(queryData).length) {
        return <></>;
    }

    return (
        <div className="legend">
            <h4 className="legend__title">
                <b>{title}</b>
            </h4>
            {colors.map((color, i) => (
                <div
                    key={i}
                    className={`legend__label ${
                        active === i ? "legend__label--active" : ""
                    }`}
                    onClick={() => {
                        if (active === i) {
                            setActive(-1);
                            dispatch(setLegendLimits(null));
                        } else {
                            const quantileValues =
                                quantiles.invertExtent(color);

                            setActive(i);
                            dispatch(
                                setLegendLimits({
                                    min: quantileValues[0],
                                    max: quantileValues[1],
                                })
                            );
                        }
                    }}
                >
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
