/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useRef } from "react";
import * as d3 from "d3";
import { observer } from "mobx-react";

import { AxisPosition } from "../Axes/Axes";
import { Domain, useD3Context, YAxisType } from "../D3SVG/D3SVG";

type YAxisProps = {
  translateX: number;
  axis: YAxisType & { domain: Domain };
  position: AxisPosition;
};

const YAxis = observer(({ translateX, axis, position }: YAxisProps) => {
  const model = useD3Context();
  const refAxis = useRef(null);
  const refTitle = useRef(null);

  if (position === AxisPosition.Left) {
    const yAxis: any = useMemo(
      () =>
        d3
          .axisLeft(model.yScale(axis.id))
          .ticks(Math.min(axis!.tickNumber ?? 6, axis.domain.max - axis!.domain.min + 1))
          .tickFormat((d) => d3.format("d")(d)),
      [model.Curves.find((curve) => curve.yId === axis.id)?.points.map((point) => point.y)]
    );
    d3.select(refAxis.current).call(yAxis.tickSize(5)).select(".domain").style("opacity", 0.1);

    d3.select(refAxis.current).selectAll("line").style("opacity", 0.1);
    d3.select(refTitle.current)
      .style("text-anchor", "middle")
      .attr("y", model.padding.top + (model.height - model.padding.bottom - model.padding.top) / 2 - 25)
      .attr("x", translateX - model.padding.left)
      .text(axis!.uom?.title ?? "")
      .attr(
        "transform",
        `rotate(-90, ${translateX - model.padding.left}, ${model.padding.top + (model.height - model.padding.bottom - model.padding.top) / 2})`
      )
      .style("fill", axis!.color ?? "black");
  }

  if (position === AxisPosition.Right) {
    const yAxis: any = useMemo(
      () =>
        d3
          .axisRight(model.yScale(axis.id))
          .ticks(Math.min(axis!.tickNumber ?? 6, axis!.domain.max - axis!.domain.min + 1))
          .tickFormat((d) => d3.format("d")(d)),
      [model.Curves.find((curve) => curve.yId === axis.id)?.points.map((point) => point.y)]
    );
    d3.select(refAxis.current).call(yAxis.tickSize(5)).select(".domain").style("opacity", 0.1);

    d3.select(refAxis.current).selectAll("line").style("opacity", 0.1);
    d3.select(refTitle.current)
      .style("text-anchor", "middle")
      .attr("y", model.padding.top + (model.height - model.padding.bottom - model.padding.top) / 2 - 45)
      .attr("x", translateX)
      .text(axis!.uom?.title ?? "")
      .attr("transform", `rotate(90, ${translateX}, ${model.padding.top + (model.height - model.padding.bottom - model.padding.top) / 2})`)
      .style("fill", axis!.color ?? "black");
  }

  return (
    <>
      <g ref={refAxis} transform={`translate(${translateX}, 0)`}></g>
      <text ref={refTitle}></text>
    </>
  );
});

export default YAxis;
