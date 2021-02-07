import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { ChoroplethMapView, Header, LineChartView, Menu } from "../components/";
import { crimeDataState } from "../atoms/index";
import { Loading } from "../components/Loading";

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
      <main className="absolute bg-gray-100 top-20 right-0 bottom-0 left-0">
        <div className="relative w-full h-full">
          {/* box */}
          <div className="p-3 pb-0 absolute top-0 right-0 left-0 h-1/4">
            <div className="rounded shadow w-full h-full bg-white p-5">
              <div className="w-full h-full">
                <LineChartView />
              </div>
            </div>
          </div>
          {/* /box */}
          {/* box */}
          <div className="p-3 absolute top-1/4 right-0 bottom-0 left-0">
            <div className="rounded shadow w-full h-full bg-white p-5">
              <div className="w-full h-full">
                <ChoroplethMapView />
              </div>
            </div>
          </div>
          {/* /box */}
          {/* box */}
          {/* <div className="p-3 pt-0 absolute right-0 bottom-0 left-0 h-1/4">
            <div className="rounded shadow w-full h-full bg-white p-5">
              <div className="w-full h-full">
                <LineChartView />
              </div>
            </div>
          </div> */}
          {/* /box */}
        </div>
      </main>
    </>
  );
}
