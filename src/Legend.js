import React from 'react';
import * as d3 from 'd3';

export const Legend = ({ colors, domain, metric }) => {
  const quantiles = d3.scaleQuantile().domain(domain).range(colors);

  return (
    <div style={{ position: 'absolute', bottom: 3.7, right: 70, background: 'white', padding: '10px', borderRadius: '5px', boxShadow: '0px 0px 5px rgba(0,0,0,0.3)' }}>
      <h4>{metric}</h4>
      {colors.map((color, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '20px', height: '20px', background: color, marginRight: '10px' }}></div>
          <span>{quantiles.invertExtent(color).map(d => d.toFixed(2)).join(' - ')}</span>
        </div>
      ))}
    </div>
  );
};