import { type FC, type ReactNode, useRef } from 'react';
import * as d3 from 'd3';

import Arc from './Arc';

import './DonutChart.css';
import { colorCarousel } from '../../../services/colorCarousel';
type DonutChartProps = {
  data: { title: ReactNode; value: number | null }[];
  innerRadius: number;
  outerRadius: number;
  children?: ReactNode;
};

const DonutChart: FC<DonutChartProps> = ({
  data: rawData,
  innerRadius,
  outerRadius,
  children,
}) => {
  const svgRef = useRef(null);
  const data = rawData.filter(({ value }) => value !== null) as { title: string; value: number }[];
  const padding = 6;
  const centerElementHeight = innerRadius + 10;
  const centerElementWidth =
    2 * (innerRadius * innerRadius - (centerElementHeight * centerElementHeight) / 4) ** 0.5;
  const pie = d3.pie();
  const data_ready = pie(data.map(({ value }) => value));
  d3.selectAll('foreignObject')
    .attr('width', centerElementWidth)
    .attr('height', centerElementHeight)
    .attr(
      'transform',
      `translate(${padding + (outerRadius - centerElementWidth / 2)}, ${
        padding + (outerRadius - centerElementHeight / 2)
      })`,
    )
    .attr('class', 'middleText');
  return (
    <div>
      <svg ref={svgRef} width={2 * (outerRadius + padding)} height={2 * (outerRadius + padding)}>
        <foreignObject>{children}</foreignObject>
        <defs>
          <filter id={'dropShadow'}>
            <feDropShadow
              stdDeviation={'4 4'}
              in="SourceGraphic"
              dx={0}
              dy={0}
              className={'filter'}></feDropShadow>
          </filter>
        </defs>
        <g
          className={'container'}
          transform={`translate(${outerRadius + padding}, ${outerRadius + padding})`}>
          {data_ready.map((arc, index) => (
            <Arc
              arcInfo={arc}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              color={colorCarousel(index)}
              filterId={'filter'}
              title={data[index].title}
              key={index}></Arc>
          ))}
        </g>
      </svg>
    </div>
  );
};

export { DonutChart, type DonutChartProps };
