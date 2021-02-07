import { atom } from "recoil";

interface CrimeData {
  data: {
    [key: string]: {
      [key: string]: Array<{
        year: number;
        month: number;
        value: number;
        normalizedValue: number;
      }>;
    };
  };
  keys: {
    crimeType: Array<string>;
    prefectures: Array<string>;
  };
}

const initialCrimeData: CrimeData = null;

export const crimeDataState = atom({
  key: "crimeDataState",
  default: initialCrimeData,
});

export const selectedPrefectureState = atom({
  key: "selectedPrefectureState",
  default: "全国",
});

export const selectedCrimeState = atom({
  key: "selectedCrimeState",
  default: "刑法犯総数",
});
