import { useEffect, useState } from "react";

import "./Legend.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import {
    _getQuantiles,
    METRICS_MAPPING,
    transformToOrganicNumbers,
} from "../../constants";
import { setLegendLimits } from "../../features/viewMode/viewModeSlice";

const Legend = () => {
    const dispatch: AppDispatch = useDispatch();
    const project = useSelector((state: RootState) => state.viewMode.project);

    const queryData = useSelector(
        (state: RootState) => state.queryData.queryData
    );
    const metric = useSelector(
        (state: RootState) => state.queryMetric.queryMetric
    );
    const dataInfo = useSelector(
        (state: RootState) => state.queryMetric.dataInfo
    );
    const _quantiles = [
        dataInfo["0.0"],
        dataInfo["0.2"],
        dataInfo["0.4"],
        dataInfo["0.6"],
        dataInfo["0.8"],
        dataInfo["1.0"],
    ];
    // const relaxedQuantiles =
    //     METRICS_MAPPING[metric].type !== "float"
    //         ? transformToOrganicNumbers(_quantiles)
    //         : _quantiles.map((x) => Math.round(x * 100) / 100);
    const relaxedQuantiles = transformToOrganicNumbers(_quantiles);
    const [quantiles, colors] = _getQuantiles(relaxedQuantiles, metric);
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
        } else if (type === "float") {
            return Number(value).toLocaleString("es-MX", {
                maximumFractionDigits: 2,
            });
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
                            .map((d: any) => formatValue(d))
                            .join(" - ")}
                    </span>
                </div>
            ))}
            {project === "culiacan_sur" && (
                <>
                    <div className="legend__label">
                        <img
                            src="https://images.vexels.com/content/155419/preview/thick-christian-cross-icon-032999.png"
                            alt="Capilla"
                        />
                        <span>Capillas</span>
                    </div>
                    <div className="legend__label">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/7033/7033682.png"
                            alt="Capilla"
                        />
                        <span>Comedores</span>
                    </div>
                </>
            )}
        </div>
    );
};

export default Legend;
