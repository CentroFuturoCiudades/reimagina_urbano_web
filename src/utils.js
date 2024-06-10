import * as d3 from "d3";
import { rgb } from "d3-color";
import { useEffect, useState } from "react";
import { FlatGeobufLoader } from '@loaders.gl/flatgeobuf';
import { load } from '@loaders.gl/core';
import { geojson } from 'flatgeobuf';

export function lightenColor(color, factor) {
  var lightened = color.map(function (c) {
    return Math.min(255, Math.round(c + 255 * factor));
  });
  return lightened;
}
export function hexToRgb(hex) {
  var r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

export function rgbToHex(rgb) {
  return (
    "#" +
    rgb
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

export function interpolateColor(color1, color2, factor) {
  if (arguments.length < 3) {
    factor = 0.5;
  }
  var result = color1.slice();
  for (var i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
  }
  return result;
}

export function generateGradientColors(startColor, endColor, steps) {
  var gradientColors = [];
  var startLight = lightenColor(hexToRgb(startColor), 0.5); // Adjust factor as needed
  var endLight = lightenColor(hexToRgb(endColor), 0.5); // Adjust factor as needed
  var halfSteps = Math.floor(steps / 2);

  for (let i = 0; i < halfSteps; i++) {
    gradientColors.push(
      rgbToHex(
        interpolateColor(hexToRgb(startColor), startLight, i / (halfSteps - 1))
      )
    );
  }

  for (let i = 0; i < halfSteps; i++) {
    gradientColors.push(
      rgbToHex(
        interpolateColor(endLight, hexToRgb(endColor), i / (halfSteps - 1))
      )
    );
  }

  return gradientColors;
}

export const useFetch = (url, initialData = undefined, list_observers = [], aborter = undefined) => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchData = async () => {
      try {
        const response = await fetch(url, { signal: abortController.signal });
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
    if (aborter) {
      abortController.abort();
    }

    return () => {
      abortController.abort();
    };
  }, [url, aborter, ...list_observers]);
  return { data };
};

export const useFetchGeo = (url, rect = undefined, initialData = undefined, dependencies = [], aborter = undefined) => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchData = async () => {
      try {
        const response = await fetchGeo(url, rect);
        setData(response);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
    if (aborter) {
      abortController.abort();
    }

    return () => {
      abortController.abort();
    };
  }, [url, aborter, ...dependencies]);
  return { data };
};


export const fetchGeo = async (url, rect = undefined, options = undefined) => {
  if (!rect) {
    return await load(url, FlatGeobufLoader, options);
  }
  let iterFeatures = await geojson.deserialize(url,
    {
      minX: rect[0],
      minY: rect[1],
      maxX: rect[2],
      maxY: rect[3],
    });
  let features = [];
  for await (const feature of iterFeatures) {
    features.push(feature);
  }
  return { features };
}

export function colorInterpolate(value, thresholds, colors, opacity = 1) {
  // Create a scale using the thresholds and colors
  const scale = d3
    .scaleLinear()
    .domain(thresholds)
    .range(colors)
    .interpolate(d3.interpolateRgb);

  const thresholdColor = rgb(scale(value));
  thresholdColor.opacity = opacity;

  return [
    thresholdColor.r,
    thresholdColor.g,
    thresholdColor.b,
    thresholdColor.opacity * 255,
  ];
}
export const addNormalized = (data, column) => {
  const min = Math.min(...data.map((x) => x[column]));
  const max = Math.max(...data.map((x) => x[column]));

  return (x) => (x[column] - min) / (max - min);
};

export const cleanedGeoData = (data, column, reversed = false) => {
  const toNormalize = addNormalized(
    data.map((x) => x.properties),
    column
  );
  return data
    .filter((feature) => feature[column] !== 0)
    .map((feature) => {
      return {
        ...feature,
        properties: {
          ...feature.properties,
          normalized: reversed
            ? 1 - toNormalize(feature.properties)
            : toNormalize(feature.properties),
        },
      };
    });
};

export const RADIAN = Math.PI / 180;
export const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize="10px"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
