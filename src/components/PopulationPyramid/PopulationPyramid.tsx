import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./PopulationPyramid.scss";
import { LegendProps } from "recharts";

interface PopulationPyramidProps {
  data: { age: string; male: number; female: number; total: number }[];
  invertAxes?: boolean; 
  showLegend?: boolean;
  additionalMarginBottom?: number;
}

const renderCustomLegend = () => (
  <div style={{ display: "flex", justifyContent: "flex-start", paddingLeft: "0px", marginLeft: "-25px" }}>
    <div style={{ display: "flex", alignItems: "center", marginRight: "15px" }}>
      <span style={{ width: "12px", height: "12px", backgroundColor: "#ff7f7f", display: "inline-block", marginRight: "5px" }}></span>
      <span>Mujeres</span>
    </div>
    <div style={{ display: "flex", alignItems: "center" }}>
      <span style={{ width: "12px", height: "12px", backgroundColor: "#8884d8", display: "inline-block", marginRight: "5px" }}></span>
      <span>Hombres</span>
    </div>
  </div>
);

const PopulationPyramid: React.FC<PopulationPyramidProps> = ({ data, invertAxes = false, showLegend = false, additionalMarginBottom = 0 }) => {
  // invertAxes true, invertimos los valores
  const transformedData = data.map((item) => ({
    ...item,
    male: invertAxes ? -item.male : item.male,
    female: invertAxes ? -item.female : item.female, 
  }));

  const renderTooltip = (props: any) => {
    if (props.payload && props.payload.length) {
      const { payload } = props.payload[0];
      const totalPopulation = payload.total;
      const totalGroup = Math.abs(payload.male) + Math.abs(payload.female);
  
      // Porcentaje de hombres y mujeres respecto al total del grupo de edad
      const malePercentage = ((Math.abs(payload.male) / totalGroup) * 100).toFixed(0);
      const femalePercentage = ((Math.abs(payload.female) / totalGroup) * 100).toFixed(0);
  
      // Porcentaje del grupo de edad respecto al total de la población
      const overallPercentage = (
        (totalPopulation / data.reduce((sum, entry) => sum + entry.total, 0)) *
        100
      ).toFixed(0);
  
      // Función para aplicar comas a los números
      const formatNumber = (number: number) => number.toLocaleString("es-MX");
  
      return (
        <div className="custom-tooltip" style={{ fontSize: "0.85em", padding: "5px" }}>
          <p style={{ fontWeight: "bold", fontSize: "1em" }}>
            {`Edades de ${payload.age}`}
          </p>
          <p style={{ color: "#8884d8" }}>
            {`Hombres: ${formatNumber(Math.abs(payload.male))} (${malePercentage}%)`}
          </p>
          <p style={{ color: "#ff7f7f" }}>
            {`Mujeres: ${formatNumber(Math.abs(payload.female))} (${femalePercentage}%)`}
          </p>
          <p>{`Total: ${formatNumber(totalPopulation)} (${overallPercentage}%)`}</p>
        </div>
      );
    }
    return null;
  };


  return (
    <ResponsiveContainer className={"pyramidContainer"} width={"100%"} height={400}>
      <BarChart
        layout="vertical"
        data={transformedData}
        margin={{ top: 20, right: invertAxes ? 0 : 30, left: invertAxes ? 30 : 0, bottom: additionalMarginBottom || 5 }}
      >
        <XAxis type="number" tickFormatter={(tick) => Math.abs(tick).toString()} />

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
        
        <Bar dataKey="male" fill="#8884d8" name="Hombres" />
        <Bar dataKey="female" fill="#ff7f7f" name="Mujeres" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PopulationPyramid;