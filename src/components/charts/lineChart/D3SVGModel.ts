import * as d3 from 'd3';
import { action, makeObservable, observable } from 'mobx';

import { clipPathInfo, CurveType, D3SVGProps, Domain, XAxisType, YAxisType } from './D3SVG/D3SVG';
import { PointType } from './Points/Point/Point';

class D3SVGModel {
  curves: Array<CurveType>;
  width: number;
  height: number;
  xAxis: XAxisType;
  yAxesLeft: Array<YAxisType & { domain: Domain }>;
  yAxesRight: Array<YAxisType & { domain: Domain }>;
  svgRef: d3.Selection<null, unknown, null, undefined>;
  padding = { top: 20, left: 20, right: 10, bottom: 25 };
  clipPaths: Array<clipPathInfo[]>;
  leftAxisCount: number;
  rightAxisCount: number;
  initXDomain: Domain;
  idleTimeout: NodeJS.Timeout | null;
  brush: any;

  constructor(svgProps: D3SVGProps, svgRef: d3.Selection<null, unknown, null, undefined>) {
    makeObservable(this, {
      svgRef: observable,
      curves: observable,
      xAxis: observable,
      yAxesLeft: observable,
      yAxesRight: observable,
      updatePoint: action,
      updateXDomain: action,
      updateYDomain: action,
      yScale: action,
      findDomain: action,
      buildCurveFall: action,
    });
    this.width = svgProps.width;
    this.height = svgProps.height;
    this.xAxis = svgProps.xAxis;
    this.svgRef = svgRef;
    this.curves = this.dataPointsProcess(svgProps.curves);
    this.initXDomain = this.xAxis.domain;
    this.idleTimeout = null;

    this.yAxesLeft = svgProps.yAxesLeft.map((axis) =>
      Object.assign(axis, {
        domain: this.findDomain(
          this.curves.find((curve) => curve.yId === axis.id)?.points,
          axis.padding,
        ),
      }),
    );
    this.yAxesRight = svgProps.yAxesRight.map((axis) =>
      Object.assign(axis, {
        domain: this.findDomain(
          this.curves.find((curve) => curve.yId === axis.id)?.points,
          axis.padding,
        ),
      }),
    );
    this.leftAxisCount =
      svgProps.yAxesLeft.filter((axis) => axis.showAxis === undefined || axis.showAxis).length ?? 0;
    this.rightAxisCount =
      svgProps.yAxesRight.filter((axis) => axis.showAxis === undefined || axis.showAxis).length ??
      0;

    this.clipPaths = Array<clipPathInfo[]>();
    svgProps.curves.forEach((curve, index) => {
      this.clipPaths.push([
        {
          x1: this.leftAxisCount * 65 + this.padding.left,
          y: this.padding.top,
          x2:
            this.leftAxisCount * 65 +
            this.padding.left +
            ((svgProps.width -
              (this.leftAxisCount + this.rightAxisCount) * 65 -
              this.padding.left -
              this.padding.right) *
              (curve.fragments[0].to - curve.fragments[0].from)) /
              (svgProps.xAxis.domain.max - svgProps.xAxis.domain.min) +
            1,
          height: svgProps.height - this.padding.bottom - this.padding.top,
        },
      ]);
      for (let i = 1; i < curve.fragments.length; ++i) {
        this.clipPaths[index].push({
          x1: this.clipPaths[index][i - 1].x2,
          y: this.padding.top,
          x2:
            this.clipPaths[index][i - 1].x2 +
            ((svgProps.width -
              (this.leftAxisCount + this.rightAxisCount) * 65 -
              this.padding.left -
              this.padding.right) *
              (curve.fragments[i].to - curve.fragments[i].from)) /
              (svgProps.xAxis.domain.max - svgProps.xAxis.domain.min) +
            1,
          height: svgProps.height - this.padding.bottom - this.padding.top,
        });
      }
    });
  }

  public updateXDomain = (min: number, max: number) => {
    this.xAxis.domain = { min: min, max: max };
  };

  public updateYDomain = (yId: number) => {
    const axis =
      this.yAxesLeft.find((axis) => axis.id === yId) ??
      this.yAxesRight.find((axis) => axis.id === yId);
    axis!.domain = this.findDomain(
      this.Curves.find((curve) => curve.yId === yId)!.points,
      axis?.padding,
    );
  };

  get xScale() {
    return d3
      .scaleLinear()
      .domain([this.xAxis.domain.min, this.xAxis.domain.max])
      .range([
        this.padding.left + 65 * this.leftAxisCount,
        this.width - this.padding.right - 65 * this.rightAxisCount,
      ]);
  }

  public yScale = (yId: number) => {
    const axis =
      this.yAxesLeft.find((axis) => axis.id === yId) ??
      this.yAxesRight.find((axis) => axis.id === yId);
    const domain = axis!.domain;
    return d3
      .scaleLinear()
      .domain([domain.min, domain.max])
      .range([this.height - this.padding.bottom, this.padding.top])
      .nice();
  };

  public findDomain = (
    array:
      | {
          x: number;
          y: number;
        }[]
      | undefined,
    padding?: number,
  ) => {
    if (array === undefined) {
      return { min: -10, max: 10 };
    }

    let min = -10,
      max = 10;

    array.forEach((item) => {
      if (item !== null) {
        min = item.y;
        max = item.y;
      }
    });

    array.forEach((item) => {
      if (item !== null) {
        if (min > item.y) {
          min = item.y;
        }
        if (max < item.y) {
          max = item.y;
        }
      }
    });

    min = min - (max - min) / 10;

    max = max + (max - min) * (padding ?? 1 / 4);
    if (max - min <= 1) {
      max += 1;
      min -= 1;
    }
    return { min: min, max: max };
  };

  get Curves() {
    return this.curves;
  }

  public updatePoint = (curveIndex: number, pointIndex: number, value: number) => {
    this.curves[curveIndex].points[pointIndex].y = value;
  };

  public points = (curveIndex: number) => {
    return this.curves[curveIndex].points;
  };

  private dataPointsProcess = (curves: CurveType[]) => {
    const updatedCurves: CurveType[] = [];
    curves.forEach((curve) => {
      const segments: PointType[][] = [[]];
      curve.points.forEach((point) => {
        if (point.x >= this.xAxis.domain.min && point.x <= this.xAxis.domain.max) {
          if (point.y === null) {
            if (curve.replaceNull !== undefined) {
              segments[segments.length - 1].push({ x: point.x, y: curve.replaceNull });
            } else {
              segments.push([]);
            }
          } else {
            segments[segments.length - 1].push(point);
          }
        }
      });
      segments.forEach((item) => {
        if (item.length > 0) {
          const clone: any = {};
          Object.assign(clone, curve);
          clone.points = item;
          updatedCurves.push(clone);
        }
      });
    });
    return updatedCurves;
  };

  public buildCurveFall = (i: number, k: number) => {
    const step = this.curves[i].points[k].y / (this.curves[i].points.length - k - 1);
    for (let j = k + 1; j < this.curves[i].points.length; ++j) {
      this.curves[i].points[j].y = this.curves[i].points[j - 1].y - step;
    }
  };
}

export { D3SVGModel };
