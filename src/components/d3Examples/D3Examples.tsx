import React from 'react';
import { DonutChart } from '../charts/donutChart/DonutChart';
import './D3Examples.css';
import D3SVG from '../charts/lineChart/D3SVG/D3SVG';
import { colorCarousel } from '../../services/colorCarousel';
import * as d3 from 'd3';

const D3Examples = () => {
  const innerRadius = 80;
  const outerRadius = 120;
  const dataDonut = [
    { title: '1', value: 20 },
    { title: '2', value: 60 },
    { title: '3', value: 120 },
    { title: '4', value: 50 },
  ];
  const dataChart1 = [
    { x: 1, y: 4 },
    { x: 2, y: 10 },
    { x: 3, y: 7 },
    { x: 4, y: 10 },
    { x: 5, y: 12 },
  ];
  const dataChart2 = [
    { x: 1, y: 20 },
    { x: 2, y: 15 },
    { x: 3, y: 10 },
    { x: 4, y: 35 },
    { x: 5, y: 7 },
  ];
  return (
    <div className="d3">
      <div className="title-2">D3 examples</div>
      <div className="d3_section">
        <div className="card">
          <DonutChart data={dataDonut} innerRadius={innerRadius} outerRadius={outerRadius}>
            <div className={'pieCenter'}>
              <span className={'pieCenterInner'}>
                {dataDonut.map((item, index) => (
                  <div key={index}>
                    {item.title}: {item.value}
                  </div>
                ))}
              </span>
            </div>
          </DonutChart>
        </div>
        <div className="card">
          <D3SVG
            curves={[
              {
                points: dataChart1,
                fragments: [
                  {
                    from: 1,
                    to: 3,
                    lineStyles: { lineStyle: 'solid' },
                    color: colorCarousel(3),
                    shadow: true,
                    opacity: 0.6,
                    fragmentBorder: false,
                    editable: true,
                  },
                  {
                    from: 3,
                    to: 5,
                    lineStyles: { lineStyle: 'dashed' },
                    color: colorCarousel(3),
                    shadow: false,
                    opacity: 0.6,
                    fragmentBorder: false,
                    editable: true,
                  },
                ],
                yId: 1,
                zIndex: -1,
                curveMethod: d3.curveBumpX,
              },
              {
                points: dataChart2,
                fragments: [
                  {
                    from: 1,
                    to: 5,
                    lineStyles: { lineStyle: 'solid' },
                    color: colorCarousel(4),
                    shadow: false,
                    opacity: 1,
                    fragmentBorder: false,
                    editable: true,
                  },
                ],
                yId: 2,
                zIndex: -1,
                curveMethod: d3.curveBumpX,
              },
            ]}
            width={600}
            height={250}
            xAxis={{
              domain: { min: 1, max: 5 },
            }}
            yAxesLeft={[]}
            yAxesRight={[
              {
                uom: { quantity: 0, measure: 0, title: `Измерение 1` },
                id: 1,
                color: colorCarousel(3),
              },
              {
                uom: {
                  quantity: 0,
                  measure: 0,
                  title: `Измерение 2`,
                },
                id: 2,
                color: colorCarousel(4),
              },
            ]}
            hideGrid={{ x: true, y: true }}></D3SVG>
          <div className='legend'>
            <h2 className='title-3'>Возможности:</h2>
            <ol>
              <li>Двигать точки</li>
              <li>Навести на точку - откроется тултип</li>
              <li>Клик на точку - откроется инпут</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default D3Examples;
