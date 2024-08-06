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

interface PopulationPyramidProps {
  data: { age: string; male: number; female: number; total: number }[];
}

const PopulationPyramid: React.FC<PopulationPyramidProps> = ({ data }) => {
  const renderTooltip = (props: any) => {
    if (props.payload && props.payload.length) {
      const { payload } = props.payload[0];
      const totalPopulation = payload.total;
      const percentage = ((totalPopulation / data.reduce((sum, entry) => sum + entry.total, 0)) * 100).toFixed(2);
      return (
        <div className="custom-tooltip">
          <p>{`Edad: ${payload.age}`}</p>
          <p style={{ color: "#8884d8" }}>{`Hombres: ${Math.abs(payload.male)}`}</p>
          <p style={{ color: "#ff7f7f" }}>{`Mujeres: ${Math.abs(payload.female)}`}</p>
          <p>{`Total: ${totalPopulation} (${percentage}%)`}</p>
        </div>
      );
    }
    return null;
  };

  console.log(data)

  return (
    <ResponsiveContainer className={"pyramidContainer"} width={200} height={400}>
      <BarChart    // ------- Revisar renderizado 
        layout="vertical"
        data = {data}

      // -------------- Cambio 

        // data={[{
        //   name: 'Page A',
        //   uv: 4000,
        //   pv: 2400,
        //   amt: 2400,
        // },
        // {
        //   name: 'Page B',
        //   uv: 3000,
        //   pv: 1398,
        //   amt: 2210,
        // },]} 

        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={"name"}
          // type="number"
          // tickFormatter={(tick) => `${Math.abs(tick)}`}
        />
        <YAxis type="category" dataKey="age" />
        {/* <Tooltip content={renderTooltip} /> */}
        <Legend />
        
        <Bar dataKey="male" fill="#8884d8" name="Hombres" />
        <Bar dataKey="female" fill="#ff7f7f" name="Mujeres" />

        {/* CAMBIO ALEX */}

        {/* <Bar dataKey="uv" fill="#8884d8" name="Hombres" />
        <Bar dataKey="pv" fill="#ff7f7f" name="Mujeres" /> */}


      </BarChart>
    </ResponsiveContainer>
  );
};

export default PopulationPyramid;






