import { Responsive } from "./Responsive";
import * as d3 from "d3";
import {
  crimeDataState,
  selectedCrimeState,
  selectedPrefectureState,
} from "../atoms";
import { useRecoilValue } from "recoil";
import { Loading } from "./Loading";

interface Data {
  year: string;
  month: number;
  value: number;
}

function CrimesLineChart({ width, height }) {
  const crimeData = useRecoilValue(crimeDataState);
  const selectedPrefecture = useRecoilValue(selectedPrefectureState);
  const margin = {
    top: 20,
    right: 60,
    bottom: 50,
    left: 60,
  };
  const contentWidth = width - margin.right - margin.left;
  const contentHeight = height - margin.top - margin.bottom;

  const axisColor = "#363636";
  const interval = contentWidth / 2;

  if (!crimeData) {
    return <Loading />;
  }

  const data: { [key: string]: Array<Data> } = {};
  crimeData.keys.crimeType.forEach((crime) => {
    data[crime] = [];
    crimeData.data[selectedPrefecture][crime].forEach((d) => {
      data[crime] = data[crime].concat(
        d.values.map((v, i) => {
          return { year: d.year, month: i + 1, value: v };
        })
      );
    });
  });

  const period: Array<{ year: string; month: number }> = crimeData.data[
    selectedPrefecture
  ]["刑法犯総数"].reduce((acc, cur) => {
    cur.values.forEach((_, i) => {
      acc.push({ year: cur.year, month: i + 1 });
    });
    return acc;
  }, []);

  const xScale = d3
    .scaleTime()
    .domain(
      d3.extent(
        data["刑法犯総数"],
        (item) => new Date(`${item.year}-${item.month}`)
      )
    )
    .range([
      contentWidth / data["刑法犯総数"].length + 1,
      contentWidth - contentWidth / data["刑法犯総数"].length + 1,
    ]);
  const yScales = {};
  crimeData.keys.crimeType.forEach((key) => {
    yScales[key] = d3
      .scaleLinear()
      .domain([
        d3.min(data[key], (item) => item.value),
        d3.max(data[key], (item) => item.value),
      ])
      .range([contentHeight, 0])
      .nice();
  });

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        <g>
          <circle cx={contentWidth / 2} cy={contentHeight / 2} r={10} />
          {crimeData.keys.crimeType.map((key) => {
            return data[key].map((item) => {
              const line = d3
                .line()
                .x((item: any) =>
                  xScale(new Date(`${item.year}-${item.month}`))
                )
                .y((item: any) => yScales[key](item.value));

              return (
                <g>
                  <path d={line(item as any)} fill="none" stroke="black" />
                </g>
              );
            });
          })}
        </g>
      </g>
    </svg>
  );
}

export function LineChartView({ type }) {
  if (type === "prefectures") {
    return null;
  } else if (type === "crimes") {
    return (
      <Responsive
        render={(width, height) => (
          <CrimesLineChart width={width} height={height} />
        )}
      />
    );
  } else {
    return null;
  }
}
