import React, { useEffect, useRef } from "react";
import {
  widget,
  ChartingLibraryWidgetOptions,
  ResolutionString,
} from "./charting_library";

export interface ChartContainerProps {
  symbol: string;
  interval: ResolutionString;
  // BEWARE: no trailing slash is expected in feed URL
  datafeedUrl: string;
  libraryPath: string;
  chartsStorageUrl: string;
  chartsStorageApiVersion: string;
  clientId: string;
  userId: string;
  fullscreen: boolean;
  autosize: boolean;
  studiesOverrides: any;
  container: string;
}

const MyTradingViewChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const getLast7DaysData = () => {
    const today = new Date();
    const data = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setSeconds(0);
      date.setMinutes(0);

      const timestamp = date.getTime();

      const open = Number((Math.random() * 1000 + 100).toFixed(2));
      const high = Number((open + Math.random() * 50).toFixed(2));
      const low = Number((open - Math.random() * 50).toFixed(2));
      const close = Number((Math.random() * (high - low) + low).toFixed(2));
      const volume = Number((Math.random() * 1000000).toFixed(0));

      data.push({
        time: Math.floor(timestamp / 1000),
        open,
        high,
        low,
        close,
        volume,
      });
    }

    return data.reverse();
  };

  // const myDatafeed = {
  //   onReady: (callback: any) => {
  //     setTimeout(() => callback({ supports_time: true }), 0);
  //   },
  //   resolveSymbol: (symbolName: string, onSymbolResolvedCallback: any) => {
  //     console.log("Symbol resolved", symbolName);

  //     setTimeout(() => {
  //       onSymbolResolvedCallback({
  //         name: symbolName,
  //         timezone: "Etc/UTC",
  //         minmov: 1,
  //         pricescale: 100,
  //         has_intraday: true,
  //         has_daily: true,
  //         has_weekly_and_monthly: true,
  //         supported_resolutions: ["1", "5", "15", "30", "60", "D"],
  //       });
  //     }, 0);
  //   },
  //   getBars: (
  //     symbolInfo: any,
  //     resolution: any,
  //     from = 1738357200,
  //     to = 1738962000,
  //     onHistoryCallback: any,
  //     onErrorCallback: any
  //   ) => {

  //     const priceData = getLast7DaysData();

  //     console.log(symbolInfo,{ priceData });

  //     if (priceData.length) {
  //       const bars = priceData.map((item) => ({
  //         time: item.time * 1000,
  //         open: item.open,
  //         high: item.high,
  //         low: item.low,
  //         close: item.close,
  //         volume: item.volume,
  //       }));
  //       onHistoryCallback(bars, { noData: false });
  //     } else {
  //       onHistoryCallback([], { noData: true });
  //     }
  //   },
  //   subscribeBars: () => {},
  //   unsubscribeBars: () => {},
  // };

  const myDatafeed = new (window as any).Datafeeds.UDFCompatibleDatafeed({
    onReady: function (callback: any) {
      console.log('DATA FEED');
      
      // Datafeed hazır olduğunda yapılacak işlemler
      callback();
    },
    resolveSymbol: function (
      symbolName: any,
      onSymbolResolvedCallback: any,
      onResolveErrorCallback: any
    ) {
      onSymbolResolvedCallback({
        name: symbolName,
        full_name: symbolName,
        exchange: "NYSE",
        minmov: 1,
        pricescale: 100,
        timezone: "America/New_York",
        ticker: symbolName,
      });
    },
    getBars: function (
      symbolInfo: any,
      resolution: any,
      from: any,
      to: any,
      onHistoryCallback: any,
      onErrorCallback: any
    ) {
      console.log('GET BARSSS');
      
      // fetch(
      //   `api/price-data?symbol=${symbolInfo.name}&resolution=${resolution}&from=${from}&to=${to}`
      // )
      //   .then((response) => response.json())
      //   .then((data) => {
          const priceData = getLast7DaysData();
          const bars = priceData.map((item) => ({
            time: item.time * 1000,
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
            volume: item.volume,
          }));
        console.log('****No Data****');
        
        onHistoryCallback(bars, { noData: false });
        // })
        // .catch(onErrorCallback);
    },
    subscribeBars: function (
      symbolInfo: any,
      resolution: any,
      onRealtimeCallback: any,
      subscriberUID: any
    ) {
      // Gerçek zamanlı verileri alma işlemi
    },
    unsubscribeBars: function (subscriberUID: any) {
      // Abonelik iptali işlemi
    },
  });

  const defaultProps: Omit<ChartContainerProps, "container"> = {
    symbol: "AAPL",
    interval: "D" as ResolutionString,
    datafeedUrl: "https://demo_feed.tradingview.com",
    libraryPath: "/charting_library/",
    chartsStorageUrl: "https://saveload.tradingview.com",
    chartsStorageApiVersion: "1.1",
    clientId: "tradingview.com",
    userId: "public_user_id",
    fullscreen: true,
    autosize: true,
    studiesOverrides: {},
  };

  useEffect(() => {
    if (chartContainerRef.current) {
      const widgetOptions: ChartingLibraryWidgetOptions = {
        symbol: defaultProps.symbol,
        datafeed: myDatafeed as any,
        interval: defaultProps.interval,
        container: chartContainerRef.current,
        library_path: defaultProps.libraryPath,
        locale: "en",
        disabled_features: ["use_localstorage_for_settings"],
        enabled_features: ["study_templates"],
        charts_storage_url: defaultProps.chartsStorageUrl,
        charts_storage_api_version: "1.1",
        client_id: defaultProps.clientId,
        user_id: defaultProps.userId,
        fullscreen: defaultProps.fullscreen,
        autosize: defaultProps.autosize,
        studies_overrides: defaultProps.studiesOverrides,
      };

      const tvWidget = new widget(widgetOptions);

      console.log({ tvWidget }, widgetOptions.datafeed);

      tvWidget.onChartReady(() => {
        console.log("Chart is ready");
      });

      // Cleanup function to remove the widget safely
      return () => {
        if (tvWidget) {
          tvWidget.remove();
        }
      };
    }
  }, []);

  return (
    <div
      ref={chartContainerRef}
      style={{ position: "relative", width: "100%", height: "400px" }}
    />
  );
};

export default MyTradingViewChart;
