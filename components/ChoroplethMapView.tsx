import { useEffect, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { Responsive } from "./Responsive";
import { GeoPath, GeoProjection } from "d3";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  crimeDataState,
  selectedCrimeState,
  selectedPrefectureState,
} from "../atoms";

interface Date {
  year: number;
  month: number;
}

function ChoroplethMap({ width, height }) {
  const [features, setFeatures] = useState([]);
  const [dates, setDates] = useState<Date[]>([
    { year: 2018, month: 1 },
    { year: 2018, month: 2 },
  ]);

  const crimeData = useRecoilValue(crimeDataState);
  const [selectedPrefecture, setSelectedPrefecture] = useRecoilState(
    selectedPrefectureState
  );
  const selectedCrime = useRecoilValue(selectedCrimeState);

  const side = Math.min(width, height);
  const scale = 2;

  const projection: GeoProjection = d3
    .geoMercator()
    .scale(side * scale)
    .center([139.69167, 35.68944])
    .translate([side / 2, side / 2]);

  const path: GeoPath = d3.geoPath().projection(projection);

  useEffect(() => {
    async function loadMapData(dataUrl: string) {
      const res = await fetch(dataUrl);
      const data = await res.json();

      const { features } = topojson.feature(data, data.objects.japan);

      setFeatures(features);
    }

    loadMapData("/data/japan.topojson");
  }, []);

  if (!crimeData) {
    return <div></div>;
  }

  const absMax = d3.max(
    crimeData?.keys.prefectures.map((prefecture) => {
      const from =
        crimeData.data[prefecture][selectedCrime][dates[0].year - 2018][
          "values"
        ][dates[0].month - 1];
      const to =
        crimeData.data[prefecture][selectedCrime][dates[1].year - 2018][
          "values"
        ][dates[1].month - 1];
      return Math.floor(((to - from) / from) * 100);
    }),
    (v: number) => Math.abs(v)
  );

  const color = d3
    .scaleLinear()
    .domain([-absMax, 0, absMax])
    .range(["#00f", "#ccc", "#f00"]);

  return (
    <svg width={side} height={side}>
      {features.map((feature) => (
        <path
          d={path(feature)}
          stroke="white"
          fill={color(
            Math.floor(
              ((crimeData.data[feature.properties.nam_ja][selectedCrime][
                dates[1].year - 2018
              ]["values"][dates[1].month - 1] -
                crimeData.data[feature.properties.nam_ja][selectedCrime][
                  dates[0].year - 2018
                ]["values"][dates[0].month - 1]) /
                crimeData.data[feature.properties.nam_ja][selectedCrime][
                  dates[0].year - 2018
                ]["values"][dates[0].month - 1]) *
                100
            )
          )}
          key={feature.properties.id}
        />
      ))}
    </svg>
  );
}

export function ChoroplethMapView() {
  return (
    <Responsive
      render={(width: number, height: number) => (
        <ChoroplethMap width={width} height={height} />
      )}
    />
  );
}
