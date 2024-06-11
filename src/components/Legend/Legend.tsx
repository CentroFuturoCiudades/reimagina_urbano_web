import React from 'react';
import * as d3 from 'd3';

import "./Legend.scss";

interface LegendProps {
  colors: number[];
  domain: number[];
  metric: string;
  legendTitles: { [key: string]: string };
}

const Legend = ( { colors, domain, metric, legendTitles }: LegendProps ) => {
  const quantiles = d3.scaleQuantize().domain( domain ).range( colors );
  const title = legendTitles[ metric ] || metric; 

  const formatValue = ( value: string ) => {
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
    <div className='legend' >
      <h4 className='legend__title'>
        <b>{title}</b>
      </h4>
      {
        colors.map((color, i) => (
          <div key={i} className='legend__label'>
            <div className='legend__icon' style={{ background: color }} />
            <span> 
              {quantiles.invertExtent(color).map( (d) => formatValue(d.toFixed(2))).join(' - ')}
            </span>
          </div>
        ))
      }
    </div>
  );
};

export default Legend;