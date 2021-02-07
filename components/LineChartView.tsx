import { Responsive } from "./Responsive";
import * as d3 from "d3";
import {
  crimeDataState,
  selectedCrimeState,
  selectedPrefectureState,
} from "../atoms";
import { useRecoilValue } from "recoil";
import { Loading } from "./Loading";

function CrimesLineChart({ width, height }) {
  const crimeData = useRecoilValue(crimeDataState);
  const selectedPrefecture = useRecoilValue(selectedPrefectureState);
  const selectedCrime = useRecoilValue(selectedCrimeState);
  const margin = {
    top: 10,
    right: 40,
    bottom: 20,
    left: 40,
  };
  const contentWidth = width - margin.right - margin.left;
  const contentHeight = height - margin.top - margin.bottom;

  const axisColor = "#363636";
  const timeFormat = d3.timeFormat("%Y-%m");

  if (!crimeData) {
    return <Loading />;
  }

  const xScale = d3
    .scaleTime()
    .domain(
      d3.extent(
        crimeData.data[selectedPrefecture][selectedCrime],
        (item) => new Date(`${item.year}-${item.month}`)
      )
    )
    .range([0, contentWidth]);

  const yScale = d3
    .scaleLinear()
    .domain([0, 1])
    .range([contentHeight, 0])
    .nice();

  const line = d3
    .line()
    .x((item: any) => xScale(new Date(`${item.year}-${item.month}`)))
    .y((item: any) => yScale(item.normalizedValue));

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        <line x1="0" y1="0" x2="0" y2={contentHeight} stroke="black" />
        {yScale.ticks(5).map((y) => {
          return (
            <g key={y} transform={`translate(0,${yScale(y)})`}>
              <line x1="0" y1="0" x2="-5" y2="0" stroke="black" />
              <text x="-8" y="5" textAnchor="end">
                {y}
              </text>
            </g>
          );
        })}
      </g>
      <g transform={`translate(${margin.left},${margin.top + contentHeight})`}>
        <line x1="0" y1="0" x2={contentWidth} y2="0" stroke="black" />
        {xScale.ticks(18).map((d, i) => {
          return (
            <g key={i} transform={`translate(${xScale(d)},0)`}>
              <line x1="0" y1="0" x2="0" y2="5" stroke="black" />
              <text y="20" textAnchor="start">
                {timeFormat(d)}
              </text>
            </g>
          );
        })}
      </g>

      <g transform={`translate(${margin.left},${margin.top})`}>
        {crimeData.keys.crimeType.map((key) => {
          return (
            <g key={key}>
              <path
                d={line(crimeData.data[selectedPrefecture][key] as any)}
                fill="none"
                stroke={color(key)}
                strokeWidth="3"
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export function LineChartView() {
  return (
    <Responsive
      render={(width, height) => (
        <CrimesLineChart width={width} height={height} />
      )}
    />
  );
}
