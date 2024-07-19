// import React from "react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import "./DonutChart.scss";

// interface DonutChartProps {
//   data: { name: string; value: number; count: number; color: string }[];
// }

// const DonutChart: React.FC<DonutChartProps> = ({ data }) => {
//   const renderTooltip = ({ payload }: any) => {
//     if (payload && payload.length) {
//       const { name, value, count } = payload[0].payload;
//       return (
//         <div className="custom-tooltip">
//           <p>{`${name} : ${value.toFixed(2)}%`}</p>
//           <p>{`Cantidad: ${count.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</p>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <ResponsiveContainer width="100%" height={400}>
//       <PieChart>
//         <Pie
//           data={data}
//           cx="50%"
//           cy="50%"
//           innerRadius={60}
//           outerRadius={80}
//           fill="#8884d8"
//           paddingAngle={5}
//           dataKey="value"
//         >
//           {data.map((entry, index) => (
//             <Cell key={`cell-${index}`} fill={entry.color} />
//           ))}
//         </Pie>
//         <Tooltip content={renderTooltip} />
//         <Legend />
//       </PieChart>
//     </ResponsiveContainer>
//   );
// };

// export default DonutChart;




import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./DonutChart.scss";

interface DonutChartProps {
  data: { name: string; value: number; count: number; color: string }[];
}

const DonutChart: React.FC<DonutChartProps> = ({ data }) => {
  const renderTooltip = ({ payload }: any) => {
    if (payload && payload.length) {
      const { name, value, count } = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p>{`${name} : ${value.toFixed(2)}%`}</p>
          <p>{`Cantidad: ${count.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={renderTooltip} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DonutChart;