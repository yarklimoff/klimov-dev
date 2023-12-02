import { useEffect, useRef } from 'react';
import { Tooltip } from 'antd';
import * as d3 from 'd3';

import './Arc.css';
type ArcProps = {
  arcInfo: d3.PieArcDatum<
    | number
    | {
        valueOf(): number;
      }
  >;
  innerRadius: number;
  outerRadius: number;
  color: string;
  filterId: string;
  title: string;
};

const TooltipTitle = (title: string, color: string, value: number, uom: string | null) => {
  return (
    <>
      <div className={'TooltipTitle'}>{title ? title : 'Другое'}</div>
      <div className={'valueRow'}>
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
          <circle cx="4" cy="4" r="4" fill={color} />
        </svg>
        <div className={'value'}>
          {value} {uom}
        </div>
      </div>
    </>
  );
};

const Arc = ({ arcInfo, innerRadius, outerRadius, color, filterId, title }: ArcProps) => {
  const arc: any = d3
    .arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .startAngle(arcInfo.startAngle)
    .endAngle(arcInfo.endAngle);
  const arcRef = useRef(null);
  useEffect(() => {
    d3.select(arcRef.current)
      .attr('d', arc)
      .attr('fill', color)
      .on('mouseover', (event, d) => {
        let arc: any;
        if (Math.abs(arcInfo.startAngle - arcInfo.endAngle) >= 0.1) {
          arc = d3
            .arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
            .startAngle(arcInfo.startAngle)
            .endAngle(arcInfo.endAngle)
            .padAngle(0.05);
        } else {
          arc = d3
            .arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
            .startAngle(arcInfo.startAngle)
            .endAngle(arcInfo.endAngle);
        }

        d3.select(`.${filterId}`).attr('flood-color', color);
        d3.select(arcRef.current)
          .transition()
          .duration(200)
          .attr('d', arc)
          .attr('filter', `url(#dropShadow)`)
          .attr('fill', color);
      })
      .on('mouseleave', () => {
        const arc: any = d3
          .arc()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius)
          .startAngle(arcInfo.startAngle)
          .endAngle(arcInfo.endAngle)
          .padAngle(0);
        d3.select(arcRef.current)
          .transition()
          .duration(200)
          .attr('d', arc)
          .attr('filter', 'url()')
          .attr('fill', color);
      });
  }, [arc, arcInfo.endAngle, arcInfo.startAngle, color, filterId, innerRadius, outerRadius]);
  return (
    <Tooltip title={TooltipTitle(title, color, arcInfo.data.valueOf(), '')}>
      <path ref={arcRef}></path>
    </Tooltip>
  );
};

export default Arc;
