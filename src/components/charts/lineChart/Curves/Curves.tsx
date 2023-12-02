import { observer } from "mobx-react";


import { useD3Context } from "../D3SVG/D3SVG";

import Curve from "./Curve";

const Curves = observer(() => {
  const model = useD3Context();
  return (
    <>
      <clipPath id={`clipPath`}>
        <rect
          x={model.padding.left + model.leftAxisCount * 65 - 5}
          y={model.padding.top}
          width={
            model.width -
            model.padding.left -
            model.padding.right -
            model.leftAxisCount * 65 -
            model.rightAxisCount * 65 +
            10
          }
          height={model.height - model.padding.top - model.padding.bottom}></rect>
      </clipPath>
      {model.curves.map((_, i) => (
        <Curve i={i} key={i}></Curve>
      ))}
    </>
  );
});

export default Curves;
