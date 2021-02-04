import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { ChoroplethMapView, Header, Menu } from "../components/";
import { crimeDataState } from "../atoms/index";

export default function Home() {
  const setCrimeData = useSetRecoilState(crimeDataState);

  useEffect(() => {
    async function loadCrimeData(dataUrl: string) {
      const res = await fetch(dataUrl);
      const data = await res.json();

      setCrimeData(data);
    }

    loadCrimeData("/data/crime_data.json");
  }, []);

  return (
    <>
      <Header />
      <main
        style={{
          top: "52px",
          right: 0,
          bottom: 0,
          left: 0,
          position: "absolute",
          overflowY: "hidden",
        }}
      >
        <div className="abusolute top-0 right-0 bottom-0 left-0">
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <div
              className="p-3"
              style={{
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                width: "100%",
                height: "20%",
              }}
            >
              <h1 className="title">36 month crimes prefecture</h1>
            </div>
            <div className="p-3">
              <Menu />
            </div>
            <div className="p-3" style={{ position: "absolute", top: "" }}>
              <ChoroplethMapView />
            </div>
            <div className="p-3">
              <h1 className="title">36 month crime prefectures</h1>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
