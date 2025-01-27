import React, { useEffect, useRef } from "react";
import {
  createChart,
  LineSeriesOptions,
  DeepPartial,
  Time,
} from "lightweight-charts";
import { priceData } from "./priceData";

const CandleChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const candleData = priceData;

    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        timeScale: {
          borderColor: "#cccccc",
          timeVisible: true,
          secondsVisible: true,
        },
      });

      chart.addCandlestickSeries().setData(
        candleData.map((d) => {
          return { ...d, time: d.time as Time };
        })
      );

      /**
       * lightweight-charts library has not addVolumePanel
       */

      /*  const volumeSeries = chart.addBarSeries({
        priceLineVisible: false,
      });
      volumeSeries.setData(candleData.map((d) => {
        
        return {...d,time: d.time as Time, volume:0.02}}
      ));

      const volumePane = chart.addVolumePane({
        size: 0.2,  
    });
    
    volumePane.addSeries(volumeSeries); */

      return () => chart.remove();
    }
  }, []);

  return (
    <div
      ref={chartContainerRef}
      style={{ position: "relative", width: "100%", height: "400px" }}
    />
  );
};

export default CandleChart;
