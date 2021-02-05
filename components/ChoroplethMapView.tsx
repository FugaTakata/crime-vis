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
import { Loading } from "./Loading";

interface Date {
  from: {
    year: number;
    month: number;
  };
  to: {
    year: number;
    month: number;
  };
}

interface Rate {
  prefecture: string;
  value: number;
}

function ChoroplethMap({ width, height }) {
  const [features, setFeatures] = useState([]);
  const [date, setDate] = useState<Date>({
    from: { year: 2018, month: 1 },
    to: { year: 2018, month: 2 },
  });

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
    return <Loading />;
  }

  // const rates: Array<number> = features?.map(({ properties: { nam_ja } }) => {
  //   const from =
  //     crimeData.data[nam_ja][selectedCrime][dates[0].year - 2018]["values"][
  //       dates[0].month - 1
  //     ];
  //   const to =
  //     crimeData.data[nam_ja][selectedCrime][dates[1].year - 2018]["values"][
  //       dates[1].month - 1
  //     ];
  //   if (from === 0) {
  //     return 100;
  //   }
  //   return Math.floor(((to - from) / from) * 100);
  // });

  const rates: Array<Rate> = crimeData.keys.prefectures.map((prefecture) => {
    const [from] = crimeData.data[prefecture][selectedCrime].filter((item) => {
      return item.month === date.from.month && item.year === date.from.year;
    });
    const [to] = crimeData.data[prefecture][selectedCrime].filter(
      (item) => item.month === date.to.month && item.year === date.to.year
    );
    if (from.value === 0) {
      return { prefecture, value: null };
    }
    if (from.value === to.value) {
      return { prefecture, value: 0 };
    }
    return {
      prefecture,
      value: Math.floor(((to.value - from.value) / from.value) * 100),
    };
  });

  const absMax = d3.max(rates, (rate) => Math.abs(rate.value));

  const color = d3
    .scaleLinear()
    .domain([-absMax, 0, absMax])
    .range(["#00f", "#ccc", "#f00"] as Iterable<number>);

  return (
    <svg width={side} height={side}>
      {features.map((feature, i) => (
        <path
          d={path(feature)}
          stroke="white"
          fill={
            rates.filter(
              (rate) => rate.prefecture === feature.properties.nam_ja
            )[0].value === null
              ? "yellow"
              : (color(
                  rates.filter(
                    (rate) => rate.prefecture === feature.properties.nam_ja
                  )[0].value
                ) as any)
          }
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
