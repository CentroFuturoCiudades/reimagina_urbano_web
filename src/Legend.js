import React from 'react';
import * as d3 from 'd3';

export const Legend = ({ colors, domain, metric, legendTitles }) => {
  const quantiles = d3.scaleQuantile().domain(domain).range(colors);
  const title = legendTitles[metric] || metric; 

  const formatValue = (value) => {
    if (title.toLowerCase().includes('porcentaje') || title.toLowerCase().includes('ratio')) {
      return `${value}%`;
    } else if (title.toLowerCase().includes('minutos') || title.toLowerCase().includes('minutes')) {
      return `${value} min`;
    } else if (title.toLowerCase().includes('área') || title.toLowerCase().includes('area')) {
      return `${value} m²`;
    }
    return value;
  };

  return (
    <div style={{ position: 'absolute', bottom: 3.7, right: 70, background: 'white', padding: '10px', borderRadius: '5px', boxShadow: '0px 0px 5px rgba(0,0,0,0.3)' }}>
      <h4>{title}</h4>
      {colors.map((color, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '20px', height: '20px', background: color, marginRight: '10px' }}></div>
          <span>{quantiles.invertExtent(color).map(d => formatValue(d.toFixed(2))).join(' - ')}</span>
        </div>
      ))}
    </div>
  );
};
