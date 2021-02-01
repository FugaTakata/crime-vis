import { atom } from "recoil";

export const crimeDataState = atom({
  key: "crimeDataState",
  default: null,
});

export const selectedPrefectureState = atom({
  key: "selectedPrefectureState",
  default: "全国",
});

export const selectedCrimeState = atom({
  key: "selectedCrimeState",
  default: "刑法犯総数",
});
