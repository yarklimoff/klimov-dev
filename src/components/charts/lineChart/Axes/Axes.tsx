import { observer } from "mobx-react";
import { useD3Context } from "../D3SVG/D3SVG";
import XAxis from "../XAxis/XAxis";
import YAxis from "../YAxis/YAxis";

enum AxisPosition {
  Left,
  Right,
}

const selectTicksNumber = (width: number) => {
  if (width < 250) {
    return 3;
  }
  return (width - 250) / 70 + 3;
};

const Axes = observer(() => {
  const { padding, yAxesLeft, yAxesRight, width } = useD3Context();
  return (
    <>
      <XAxis />
      {yAxesLeft
        .filter((axis) => axis.showAxis === undefined || axis.showAxis)
        .map((yAxis, key) => {
          return (
            <YAxis
              key={key}
              translateX={padding.left + (key + 1) * 65}
              axis={yAxis}
              position={AxisPosition.Left}
            />
          );
        })}
      {yAxesRight
        .filter((axis) => axis.showAxis === undefined || axis.showAxis)
        .map((yAxis, key) => {
          return (
            <YAxis
              key={100 + key}
              translateX={width - (key + 1) * 65 - padding.right}
              axis={yAxis}
              position={AxisPosition.Right}
            />
          );
        })}
    </>
  );
});

export default Axes;
export { AxisPosition, selectTicksNumber };
