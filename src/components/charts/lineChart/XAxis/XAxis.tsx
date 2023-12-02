import { useMemo } from 'react';
import * as d3 from 'd3';
import { observer } from 'mobx-react';

import { selectTicksNumber } from '../Axes/Axes';
import { useD3Context } from '../D3SVG/D3SVG';

import './XAxis.css';

const XAxis = observer(() => {
  const model = useD3Context();
  const xAxisFigure: any = useMemo(
    () =>
      d3
        .axisBottom(model.xScale)
        .ticks(
          Math.min(
            selectTicksNumber(model.width),
            model.xAxis.domain.max - model.xAxis.domain.min + 1,
          ),
        )
        .tickFormat((d) => d3.format('d')(d as any)),
    [model.width, model.xAxis.domain.max, model.xAxis.domain.min, model.xScale],
  );

  model.svgRef.select(`.x-axis`).call(xAxisFigure).select('.domain').style('opacity', 0.1);
  model.svgRef.select(`.x-axis`).selectAll('line').style('opacity', 0.1);

  return (
    <>
      <g
        className={`x-axis`}
        transform={`translate(0, ${model.height - model.padding.bottom})`}></g>
      <text>{model.xAxis.domain.min}</text>
    </>
  );
});

export default XAxis;
