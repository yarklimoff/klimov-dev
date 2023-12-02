/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo } from "react";
import * as d3 from "d3";
import { observer } from "mobx-react";

import { useD3Context } from "../D3SVG/D3SVG";

type CurveProps = {
  i: number;
};

const Curve = observer(({ i }: CurveProps) => {
  const model = useD3Context();
  const generateScaledLine = useMemo(
    () =>
      d3
        .line<any>()
        .x((d) => model.xScale(d.x))
        .y((d) => model.yScale(model.curves[i].yId)(d.y))
        .curve(model.curves[i].curveMethod ?? d3.curveLinear),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      i,
      model,
      model.xScale,
      (model.yAxesLeft.find((axis) => axis.id === model.curves[i].yId) ?? model.yAxesRight.find((axis) => axis.id === model.curves[i].yId))?.domain,
    ]
  );
  useEffect(() => {
    model.curves[i].fragments.forEach((fragment, j) => {
      model.svgRef
        .select(`.line-${i}-${j}`)
        .datum(model.curves[i].points)
        .attr("d", generateScaledLine)
        .attr("fill", "none")
        .attr("stroke", fragment.color)
        .style(
          "stroke-dasharray",
          fragment.lineStyles.lineStyle === "dashed" ? `${fragment.lineStyles.dashLength ?? 5},${fragment.lineStyles.dashLength ?? 5}` : "1,0"
        )
        .style("stroke-width", fragment.lineStyles.lineWidth ?? 2);
      if (fragment.shadow) {
        const area = d3
          .area()
          .x((d) => {
            return model.xScale(d[0]);
          })
          .y0((d) => model.height + model.padding.top)
          .y1((d) => {
            return model.yScale(model.curves[i].yId)(d[1]);
          })
          .curve(model.curves[i].curveMethod ?? d3.curveLinear);
        model.svgRef
          .select(`.area-${i}-${j}`)
          .attr("d", area(model.curves[i].points.map((e) => [e.x, e.y])))
          .style("fill", model.curves[i].fragments[j].color)
          .style("opacity", model.curves[i].fragments[j].opacity ?? 1)
          .style("z-index", model.curves[i].zIndex ?? 1);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model.curves[i].points.map((point) => point.y)]);
  return (
    <>
      {model.curves[i].fragments.map((fragment, j) => (
        <g key={j}>
          <clipPath id={`clipPath-${i}-${j}`} key={100 + j}>
            <rect
              x={model.clipPaths[i][j].x1}
              y={model.clipPaths[i][j].y}
              width={model.clipPaths[i][j].x2 - model.clipPaths[i][j].x1}
              height={model.clipPaths[i][j].height}
            ></rect>
          </clipPath>
          <path
            className={`line-${i}-${j}`}
            clipPath={`url(#${`clipPath-${i}-${j}`})`}
            key={200 + j}
          ></path>
          {fragment.shadow ? (
            <path
              className={`area-${i}-${j}`}
              clipPath={`url(#${`clipPath-${i}-${j}`})`}
              key={300 + j}
            ></path>
          ) : (
            <></>
          )}
        </g>
      ))}
    </>
  );
});

export default Curve;
