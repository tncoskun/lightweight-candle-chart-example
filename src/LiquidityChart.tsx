import React, { useEffect, useRef } from "react";
import {
  createChart,
  LineSeriesOptions,
  DeepPartial,
  Time,
} from "lightweight-charts";
import { priceData } from "./priceData";

const LiquidityChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  const orderBookData = {
    bids: [
        { price: 100, volume: 50 },
        { price: 99, volume: 40 },
        { price: 98, volume: 30 },
        // Diğer alıcı emirleri...
    ],
    asks: [
        { price: 101, volume: 60 },
        { price: 102, volume: 80 },
        { price: 103, volume: 50 },
        // Diğer satıcı emirleri...
    ]
};


  useEffect(() => {


    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
       
      });
    
    // Alıcılar için histogram serisi
    const bidSeries = chart.addHistogramSeries({
        color: 'green',
    });


    const bidData = orderBookData.bids.map((bid,i) => ({
        time: Math.floor(new Date().getTime() / 1000)+(i*900 ) as Time,
        value: bid.volume,
        price: bid.price,
    })).sort((a,b)=>Number(a.time)-Number(b.time));
    
    bidSeries.setData(bidData);
    
    // Satıcılar için histogram serisi
    const askSeries = chart.addHistogramSeries({
        color: 'red',
    });
    
    const askData = orderBookData.asks.map((ask,i) => ({
        time: Math.floor(new Date().getTime() / 1000)+(i*900 ) as Time, 
        value: ask.volume,
        price: ask.price,
    })).sort((a,b)=>Number(a.time)-Number(b.time));
    askSeries.setData(askData);

    

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

export default LiquidityChart;
