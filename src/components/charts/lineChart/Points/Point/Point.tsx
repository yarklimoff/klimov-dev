/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useRef, useState } from 'react';
import { FallOutlined } from '@ant-design/icons';
import { Button, InputNumber, Popover } from 'antd';
import * as d3 from 'd3';
import { observer } from 'mobx-react';
import { useD3Context } from '../../D3SVG/D3SVG';

import './Point.css';
type PointType = {
  x: number;
  y: number;
};
type PointProps = {
  i: number;
  k: number;
  yId: number;
  color: string;
  axisTitle: string;
  editable?: boolean;
};

const tooltipTitle = (
  header: string,
  color: string,
  value: number,
  uom: string,
  year: number,
  edit: boolean,
  editable: boolean | undefined,
  updatePoint: (value: number) => void,
  buildCurveFall: () => void,
) => {
  return (
    <div className={'point_tooltip'}>
      <div className={'point_header'}>{header} </div>
      <div className={'point_valueRow'}>
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
          <circle cx="4" cy="4" r="4" fill={color} />
        </svg>
        <div className={'point_value'}>
          {edit ? (
            <InputNumber
              value={Math.round(value * 1000) / 1000}
              size="small"
              onChange={(value) => {
                updatePoint(value ?? 0);
              }}></InputNumber>
          ) : (
            <>{Math.round(value * 1000) / 1000}</>
          )}
          {uom}
        </div>
      </div>
      <div className={'point_value'}>{year} год</div>
    </div>
  );
};

const Point = observer(({ i, k, yId, color, axisTitle, editable }: PointProps) => {
  const model = useD3Context();
  const [edit, setEdit] = useState(false);
  const refVisible = useRef<SVGCircleElement | null>(null);
  const refUnvisible = useRef<SVGCircleElement | null>(null);
  d3.select(refUnvisible.current)
    .on('mouseover', function (event) {
      d3.select(refVisible.current).style('opacity', 1);
    })
    .on('mouseout', function (event) {
      if (editable === undefined || editable === false) {
        d3.select(refVisible.current).style('opacity', 0);
      }
    })
    .on('click', function (event) {
      if (editable === true) {
        setEdit(true);
      }
    });
  const dragHandler: any = d3
    .drag()
    .on('drag', (event) => {
      model.updatePoint(
        i,
        k,
        model.yScale(yId).invert(model.yScale(yId)(model.curves[i].points[k].y) + event.dy),
      );
      d3.select(refVisible.current).attr('cy', model.yScale(yId)(model.curves[i].points[k].y));
      d3.select(refUnvisible.current).attr('cy', model.yScale(yId)(model.curves[i].points[k].y));
    })
    .on('end', () => {
      model.updateYDomain(yId);
    });

  if (editable) {
    d3.select(refUnvisible.current).style('cursor', 'ns-resize');
    dragHandler(d3.select(refVisible.current));
    dragHandler(d3.select(refUnvisible.current));
  }

  const popoverContent = useMemo(
    () =>
      tooltipTitle(
        axisTitle.split(',')[0],
        color,
        model.curves[i].points[k].y,
        axisTitle.split(',')[1],
        model.curves[i].points[k].x,
        edit,
        editable,
        (value: number) => {
          model.updatePoint(i, k, value);
          model.updateYDomain(yId);
        },
        () => model.buildCurveFall(i, k),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [axisTitle, color, edit, i, k, model.curves[i].points[k].y],
  );

  return (
    <g>
      <circle
        ref={refVisible}
        r={4}
        cx={model.xScale(model.curves[i].points[k].x)}
        cy={useMemo(
          () => model.yScale(yId)(model.curves[i].points[k].y),

          [
            i,
            k,
            model,
            model.yAxesLeft.map((axis) => axis.domain),
            model.yAxesRight.map((axis) => axis.domain),
            model.curves[i].points[k].y,
          ],
        )}
        fill={color}
        stroke="white"
        strokeWidth={2}
        opacity={editable === true ? 1 : 0}
        clipPath={`url(#clipPath)`}></circle>
      <Popover
        trigger={'hover'}
        content={popoverContent}
        fresh={true}
        color={'black'}
        destroyTooltipOnHide={true}
        onOpenChange={(visible) => {
          setEdit(false);
        }}>
        <circle
          ref={refUnvisible}
          r={10}
          cx={model.xScale(model.curves[i].points[k].x)}
          cy={useMemo(
            () => model.yScale(yId)(model.curves[i].points[k].y),

            [
              i,
              k,
              model,
              yId,
              ...model.yAxesLeft.map((axis) => axis.domain),
              ...model.yAxesRight.map((axis) => axis.domain),
              model.curves[i].points[k].y,
            ],
          )}
          fill={color}
          stroke="white"
          strokeWidth={2}
          opacity={0}
          clipPath={`url(#clipPath)`}></circle>
      </Popover>
    </g>
  );
});

export default Point;
export type { PointType };
