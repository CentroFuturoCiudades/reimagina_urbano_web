import React from 'react';
import * as d3 from 'd3';

export const Legend = ({ colors, domain, metric, legendTitles }) => {
  const quantiles = d3.scaleQuantize().domain(domain).range(colors);
  const title = legendTitles[metric] || metric; 

  const formatValue = (value) => {
    const formattedValue = Number(value).toLocaleString('en-US');
    if (title.toLowerCase().includes('porcentaje') || title.toLowerCase().includes('ratio')) {
      return `${formattedValue}%`;
    } else if (title.toLowerCase().includes('minutos') || title.toLowerCase().includes('minutes')) {
      return `${formattedValue} min`;
    } else if (title.toLowerCase().includes('área') || title.toLowerCase().includes('area')) {
      return `${formattedValue} m²`;
    }
    return formattedValue;
  };

  return (
    <div style={{ position: 'absolute', bottom: '1dvh', right: '1dvw', background: 'white', padding: '10px', borderRadius: '5px', boxShadow: '0px 0px 5px rgba(0,0,0,0.3)', width: 'fit-content' }}>
      <h4 style={{ width: 'min-content' }}><b>{title}</b></h4>
      {colors.map((color, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '20px', height: '20px', background: color, marginRight: '10px' }}></div>
          <span>{quantiles.invertExtent(color).map(d => formatValue(d.toFixed(2))).join(' - ')}</span>
        </div>
      ))}
    </div>
  );
};
