import { observer } from "mobx-react";


import { useD3Context } from "../D3SVG/D3SVG";

import Curve from "./Curve";

const Curves = observer(() => {
  const model = useD3Context();
  return (
    <>
      
      {model.curves.map((_, i) => (
        <Curve i={i} key={i}></Curve>
      ))}
    </>
  );
});

export default Curves;
