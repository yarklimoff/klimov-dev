import React, { ReactNode, useContext, useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { observer } from 'mobx-react-lite';

import Axes from '../Axes/Axes';
import Curves from '../Curves/Curves';
import { D3SVGModel } from '../D3SVGModel';
import { PointType } from '../Points/Point/Point';
import Points from '../Points/Points';

import './D3SVG.css';

type uomType = {
  quantity: number;
  measure: number;
  title?: string;
};
type XAxisType = {
  uom?: uomType;
  id?: number;
  color?: string;
  domain: Domain;
  tickNumber?: number;
  showAxis?: boolean;
};

type YAxisType = {
  uom?: uomType;
  id: number;
  color?: string;
  tickNumber?: number;
  showAxis?: boolean;
  padding?: number;
};
type LineStyle = {
  lineStyle: string;
  dashLength?: number;
  lineWidth?: number;
};

type FragmentInfo = {
  from: number;
  to: number;
  lineStyles: LineStyle;
  color: string;
  shadow: boolean;
  opacity?: number;
  fragmentBorder?: boolean;
  fragmentBorderMoving?: boolean;
  editable?: boolean;
};

type CurveType = {
  points: Array<PointType>;
  setPoints?: React.Dispatch<
    React.SetStateAction<
      {
        x: number;
        y: number;
      }[]
    >
  >;
  fragments: Array<FragmentInfo>;
  curveMethod?: d3.CurveFactory;
  yId: number;
  zIndex?: number;
  replaceNull?: number;
};

type clipPathInfo = {
  x1: number;
  y: number;
  x2: number;
  height: number;
};

type Domain = {
  min: number;
  max: number;
};

type D3SVGProps = {
  curves: Array<CurveType>;
  width: number;
  height: number;
  xAxis: XAxisType;
  yAxesLeft: Array<YAxisType>;
  yAxesRight: Array<YAxisType>;
  hideGrid?: { x?: boolean; y?: boolean };
  children?: ReactNode;
};

const D3Context = React.createContext<D3SVGModel | null>(null);

type yScales = {
  [key: number]: d3.ScaleLinear<number, number, never>;
};

const D3SVG = observer((svgProps: D3SVGProps) => {
  const svgRef = useRef(null);
  const svg = d3.select(svgRef.current);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const D3Store = new D3SVGModel(svgProps, svg);

  return (
    <svg className={'chartContainer'} ref={svgRef} width={svgProps.width} height={svgProps.height}>
      <D3Context.Provider value={D3Store}>
        <Axes></Axes>
        <Curves></Curves>
        <Points></Points>
      </D3Context.Provider>
    </svg>
  );
});

const useD3Context = () => {
  const context = useContext(D3Context);
  if (context === null) {
    console.assert('Контекст не указан');
  }
  return context!;
};

export default D3SVG;
export type { clipPathInfo, CurveType, D3SVGProps, Domain, XAxisType, YAxisType, yScales };
export { useD3Context };
