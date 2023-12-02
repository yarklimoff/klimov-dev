import { observer } from "mobx-react";

import { useD3Context } from "../D3SVG/D3SVG";

import Point from "./Point/Point";

const Points = observer(() => {
  const model = useD3Context();
  return (
    <>
      {model.curves.map((curve, i) =>
        curve.points.map((point, k) => (
          <Point
            key={i * 100 + k}
            i={i}
            k={k}
            yId={curve.yId}
            color={curve.fragments.find((fragment) => point.x <= fragment.to && point.x >= fragment.from)?.color ?? "blue"}
            axisTitle={
              model.yAxesLeft.find((axis) => axis.id === curve.yId)?.uom?.title ??
              model.yAxesRight.find((axis) => axis.id === curve.yId)?.uom?.title ??
              ""
            }
            editable={curve.fragments.find((fragment) => point.x <= fragment.to && point.x >= fragment.from)?.editable ?? false}
          ></Point>
        ))
      )}
    </>
  );
});

export default Points;
